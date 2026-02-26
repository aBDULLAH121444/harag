'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CAR_MAKES, CAR_MODELS, CAR_YEARS, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, YEMENI_GOVERNORATES } from '@/lib/constants';
import { Loader2, Save, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import Link from 'next/link';
import { collection, addDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';


const listingFormSchema = z.object({
  make: z.string().min(1, 'الشركة المصنعة مطلوبة'),
  model: z.string().min(1, 'الموديل مطلوب'),
  year: z.string().min(1, 'السنة مطلوبة'),
  price: z.string().min(1, 'السعر مطلوب').regex(/^\d+$/, "يجب أن يكون السعر رقمًا"),
  currency: z.string().min(1, 'العملة مطلوبة'),
  mileage: z.string().min(1, 'المسافة المقطوعة مطلوبة').regex(/^\d+$/, "يجب أن تكون المسافة المقطوعة رقمًا"),
  location: z.string().min(1, 'الموقع مطلوب'),
  description: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

export default function ListingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      price: '',
      currency: 'ريال سعودي',
      mileage: '',
      location: '',
      description: '',
    },
  });
  
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      });
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (isEditing && firestore && user) {
        const fetchListing = async () => {
            const docRef = doc(firestore, "carListings", editId!);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.userId === user.uid) {
                    form.reset({
                        make: data.make,
                        model: data.model,
                        year: String(data.year),
                        price: String(data.price),
                        currency: data.currency,
                        mileage: String(data.mileage),
                        location: data.location,
                        description: data.description,
                    });
                    setImagePreviews(data.images || []);
                } else {
                    toast({ variant: "destructive", title: "غير مصرح به", description: "ليس لديك إذن لتعديل هذا الإعلان." });
                    router.push('/dashboard');
                }
            } else {
                toast({ variant: "destructive", title: "لم يتم العثور عليه", description: "الإعلان غير موجود." });
                router.push('/dashboard');
            }
        };
        fetchListing();
    }
  }, [isEditing, editId, firestore, user, form, router, toast]);

  const selectedMake = form.watch('make');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles(fileArray);
      
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      });

      const previewArray = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previewArray);
    } else {
      setImageFiles([]);
      setImagePreviews([]);
    }
  };

  async function onSubmit(data: ListingFormValues) {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'يجب عليك تسجيل الدخول لإنشاء إعلان.' });
      return;
    }
    setIsSubmitting(true);
    setStatus("");
    
    try {
        let finalImageUrls: string[] = [];

        if (imageFiles.length > 0) {
            setStatus(`جاري رفع ${imageFiles.length} ${imageFiles.length > 1 ? 'صور' : 'صورة'}...`);
            const uploadPromises = imageFiles.map(file => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData })
                    .then(res => res.json());
            });
            const uploadResults = await Promise.all(uploadPromises);
            finalImageUrls = uploadResults.map(result => {
                if (!result.secure_url) {
                    throw new Error(result.error?.message || "فشل رفع الصورة.");
                }
                return result.secure_url;
            });
        } else if (isEditing) {
            finalImageUrls = imagePreviews;
        } else {
            finalImageUrls = PlaceHolderImages.filter(img => !img.id.startsWith('avatar-') && !img.id.startsWith('logo-'))
                                               .sort(() => 0.5 - Math.random())
                                               .slice(0, 3)
                                               .map(img => img.imageUrl);
        }

        const listingData = {
            title: `${data.year} ${data.make} ${data.model}`,
            make: data.make,
            model: data.model,
            year: parseInt(data.year, 10),
            price: parseInt(data.price, 10),
            currency: data.currency,
            description: data.description || '',
            images: finalImageUrls,
            mileage: parseInt(data.mileage, 10),
            location: data.location,
            condition: 'جيد',
            features: [],
            updatedAt: serverTimestamp(),
        };

        if (isEditing) {
            setStatus("جاري تحديث الإعلان...");
            const docRef = doc(firestore, 'carListings', editId!);
            await updateDoc(docRef, listingData);
            toast({ title: 'تم تحديث الإعلان', description: 'تم تحديث إعلانك بنجاح!' });
        } else {
            setStatus("جاري إنشاء الإعلان...");
            const userProfileRef = doc(firestore, 'users', user.uid);
            const userProfileSnap = await getDoc(userProfileRef);

            if (!userProfileSnap.exists()) {
                throw new Error("لم يتم العثور على ملفك الشخصي.");
            }
            const userProfile = userProfileSnap.data();

            const newListingData = {
                ...listingData,
                userId: user.uid,
                status: 'active',
                createdAt: serverTimestamp(),
                viewCount: 0,
                sellerName: userProfile.name,
                sellerPhoneNumber: userProfile.phoneNumber,
                sellerPhotoURL: userProfile.photoURL || null,
                sellerJoinedAt: userProfile.createdAt,
            };
            await addDoc(collection(firestore, 'carListings'), newListingData);
            toast({ title: 'تم إنشاء الإعلان', description: 'تم إنشاء قائمتك بنجاح!' });
        }
        router.push('/dashboard');

    } catch (err: any) {
        console.error("Submission failed:", err);
        toast({ variant: 'destructive', title: 'فشل الإرسال', description: err.message || 'حدث خطأ. يرجى المحاولة مرة أخرى.' });
    } finally {
        setIsSubmitting(false);
        setStatus("");
    }
  }

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>يرجى تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <p>يجب عليك تسجيل الدخول لإنشاء إعلان جديد.</p>
          <Button asChild className="mt-4">
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">تفاصيل السيارة</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشركة المصنعة</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('model', '');
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="اختر الشركة" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{CAR_MAKES.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموديل</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedMake}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{selectedMake && CAR_MODELS[selectedMake]?.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السنة</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="اختر السنة" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{CAR_YEARS.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المسافة المقطوعة (كم)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="مثال: 80000" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="مثال: 95000" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العملة</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="اختر العملة" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="ريال سعودي">ريال سعودي</SelectItem>
                        <SelectItem value="ريال يمني">ريال يمني</SelectItem>
                        <SelectItem value="دولار أمريكي">دولار أمريكي</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>الموقع</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="اختر الموقع" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{YEMENI_GOVERNORATES.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
            <CardHeader><CardTitle className="text-lg">صور الإعلان</CardTitle></CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                        <FormItem>
                            <FormLabel>ارفع صورًا لسيارتك</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="rounded-lg" />
                            </FormControl>
                            <FormDescription>يمكنك اختيار عدة صور لسيارتك.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {imagePreviews.map((preview, index) => (
                             <div key={index} className="relative aspect-video">
                                <Image src={preview} alt={`معاينة الصورة ${index + 1}`} fill className="rounded-lg object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">الوصف</CardTitle>
          </CardHeader>
          <CardContent>
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف الإعلان</FormLabel>
                  <FormControl>
                    <Textarea placeholder="صف سيارتك بالتفصيل..." className="min-h-[120px] rounded-lg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full rounded-xl font-bold h-12" disabled={isSubmitting}>
           {isSubmitting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : (isEditing ? <Edit className="ml-2 h-5 w-5" /> : <Save className="ml-2 h-5 w-5" />)}
           {isSubmitting ? (status || 'جاري الإرسال...') : (isEditing ? 'تحديث الإعلان' : 'إنشاء الإعلان')}
        </Button>
      </form>
    </Form>
  );
}
