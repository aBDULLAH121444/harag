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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CAR_MAKES, CAR_MODELS, CAR_YEARS, CAR_FEATURES } from '@/lib/constants';
import { generateCarDescription } from '@/lib/actions';
import { Wand2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FirebaseError } from 'firebase/app';


const listingFormSchema = z.object({
  make: z.string().min(1, 'الشركة المصنعة مطلوبة'),
  model: z.string().min(1, 'الموديل مطلوب'),
  year: z.string().min(1, 'السنة مطلوبة'),
  price: z.string().min(1, 'السعر مطلوب').regex(/^\d+$/, "يجب أن يكون السعر رقمًا"),
  mileage: z.string().min(1, 'المسافة المقطوعة مطلوبة').regex(/^\d+$/, "يجب أن تكون المسافة المقطوعة رقمًا"),
  location: z.string().min(1, 'الموقع مطلوب'),
  condition: z.string().min(1, 'الحالة مطلوبة'),
  description: z.string().min(50, 'يجب أن لا يقل الوصف عن 50 حرفًا'),
  features: z.array(z.string()),
  sellerNotes: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

export default function ListingForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      location: '',
      condition: '',
      description: '',
      features: [],
      sellerNotes: '',
    },
  });

  const selectedMake = form.watch('make');

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const values = form.getValues();
    const year = parseInt(values.year, 10);
    const mileage = parseInt(values.mileage, 10);
    const price = parseInt(values.price, 10);

    if (isNaN(year) || isNaN(mileage) || isNaN(price)) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'يرجى إدخال قيم رقمية صالحة للسنة والسعر والمسافة المقطوعة.' });
      setIsGenerating(false);
      return;
    }
    
    const result = await generateCarDescription({
      make: values.make,
      model: values.model,
      year: parseInt(values.year, 10),
      mileage: parseInt(values.mileage, 10),
      price: parseInt(values.price, 10),
      condition: values.condition,
      features: values.features,
      sellerNotes: values.sellerNotes,
    });
    setIsGenerating(false);

    if (result.description) {
      form.setValue('description', result.description, { shouldValidate: true });
      toast({ title: 'نجاح', description: 'تم إنشاء الوصف بنجاح!' });
    } else {
      toast({ variant: 'destructive', title: 'خطأ', description: result.error });
    }
  };

  async function onSubmit(data: ListingFormValues) {
    if (!user) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'يجب عليك تسجيل الدخول لإنشاء إعلان.' });
      return;
    }
     if (!firestore) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'فشلت تهيئة قاعدة البيانات.' });
      return;
    }
    setIsSubmitting(true);
    
    try {
        const carListingsRef = collection(firestore, 'carListings');

        const carImages = PlaceHolderImages.filter(img => !img.id.startsWith('avatar-'))
                                             .sort(() => 0.5 - Math.random())
                                             .slice(0, 3)
                                             .map(img => img.imageUrl);

        const newListingData = {
            userId: user.uid,
            title: `${data.year} ${data.make} ${data.model}`,
            make: data.make,
            model: data.model,
            year: parseInt(data.year, 10),
            price: parseInt(data.price, 10),
            currency: 'ريال سعودي',
            description: data.description,
            images: carImages,
            mileage: parseInt(data.mileage, 10),
            location: data.location,
            condition: data.condition,
            features: data.features,
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            viewCount: 0,
        };

        await addDoc(carListingsRef, newListingData);

        toast({ title: 'تم إنشاء القائمة', description: 'تم إنشاء قائمتك بنجاح!' });
        router.push('/dashboard');

    } catch (e) {
        console.error("Error creating listing:", e);
        let description = 'حدث خطأ أثناء إنشاء الإعلان. الرجاء معاودة المحاولة.';
        if (e instanceof FirebaseError) {
          if (e.code === 'permission-denied') {
            description = 'ليس لديك الإذن لإنشاء إعلان. تأكد من أنك مسجل الدخول.'
          }
        }
        toast({ variant: 'destructive', title: 'خطأ', description });
    } finally {
        setIsSubmitting(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل السيارة</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشركة المصنعة</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('model', '');
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="اختر الشركة المصنعة" /></SelectTrigger>
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
                      <SelectTrigger><SelectValue placeholder="اختر الموديل" /></SelectTrigger>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="اختر السنة" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{CAR_YEARS.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر (ريال سعودي)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="مثال: 95000" {...field} />
                  </FormControl>
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
                    <Input type="number" placeholder="مثال: 80000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموقع</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="اختر الموقع" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{["صنعاء", "عدن", "تعز", "الحديدة", "إب", "المكلا"].map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الحالة والميزات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الحالة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="اختر حالة السيارة" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{['جديد', 'شبه جديد', 'جيد', 'مقبول'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                    <FormLabel>الميزات</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CAR_FEATURES.map((feature) => (
                        <FormField
                            key={feature}
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                            <FormItem key={feature} className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(feature)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), feature])
                                        : field.onChange(field.value?.filter((value) => value !== feature));
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">{feature}</FormLabel>
                            </FormItem>
                            )}
                        />
                        ))}
                    </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الوصف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف الإعلان</FormLabel>
                  <FormControl>
                    <Textarea placeholder="صف سيارتك بالتفصيل..." className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormDescription>الوصف المفصل يساعد على بيع سيارتك بشكل أسرع. 50 حرفًا على الأقل.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sellerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات البائع (اختياري)</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: تمت الصيانة مؤخرًا، إطارات جديدة" {...field} />
                  </FormControl>
                   <FormDescription>أضف أي مميزات إضافية لمساعد الذكاء الاصطناعي.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="outline" onClick={handleGenerateDescription} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="ml-2 h-4 w-4" />}
              {isGenerating ? 'جاري الإنشاء...' : 'مساعد الوصف الذكي'}
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
           {isSubmitting ? 'جاري الإرسال...' : 'إنشاء الإعلان'}
        </Button>
      </form>
    </Form>
  );
}
