'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Car, Loader2, AlertTriangle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const signupSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phoneNumber: z.string().regex(/^7[01378]\d{7}$/, "يرجى إدخال رقم هاتف يمني صالح (9 أرقام تبدأ بـ 7)"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// Helper to create the fake email
const createFakeEmailFromPhone = (phone: string) => `+967${phone}@haraj-yemen.app`;

export default function SignupPage() {
    const router = useRouter();
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", phoneNumber: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        if (!auth || !firestore) {
            toast({ variant: "destructive", title: "خطأ في التهيئة" });
            return;
        };
        setIsSubmitting(true);

        try {
            const fakeEmail = createFakeEmailFromPhone(values.phoneNumber);
            
            // Step 1: Create user with fake email and password
            const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, values.password);
            const user = userCredential.user;
            
            // Step 2: Update Firebase Auth profile with display name
            await updateProfile(user, { displayName: values.name });
            
            // Step 3: Create user profile document in Firestore
            const userDocRef = doc(firestore, "users", user.uid);
            const userProfile = {
                id: user.uid,
                name: values.name,
                email: values.email,
                phoneNumber: `+967${values.phoneNumber}`, // Store with country code
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            await setDoc(userDocRef, userProfile);

            toast({ title: "تم تسجيل الحساب بنجاح!" });
            router.push('/dashboard');

        } catch (error) {
            console.error("Signup Error:", error);
            let description = "حدث خطأ غير متوقع.";
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/email-already-in-use') {
                    description = "هذا الرقم مسجل بالفعل. حاول تسجيل الدخول.";
                }
            }
            toast({ variant: "destructive", title: "فشل تسجيل الحساب", description });
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
             <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                <Car className="h-10 w-10 text-primary" />
            </Link>
            <CardTitle className="text-2xl font-headline">تسجيل حساب جديد</CardTitle>
            <CardDescription>
                املأ معلوماتك لإنشاء حساب
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>الاسم الكامل</FormLabel>
                            <FormControl>
                                <Input placeholder="أحمد علي" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>رقم الهاتف</FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <span className="border border-l-0 rounded-r-md px-3 py-2 bg-muted text-muted-foreground">+967</span>
                                        <Input placeholder="771234567" {...field} className="rounded-l-md rounded-r-none text-left" dir="ltr" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="font-semibold">تنبيه مهم</AlertTitle>
                        <AlertDescription>
                        رقمك الذي ستسجل به سيظهر للمشترين وهو الوسيلة للتواصل معك.
                        </AlertDescription>
                    </Alert>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : 
                            <UserPlus className="ml-2 h-4 w-4" />
                        }
                        {isSubmitting ? 'جاري التسجيل...' : 'تسجيل'}
                    </Button>
                </form>
            </Form>
            
            <div className="mt-4 text-center text-sm">
            هل لديك حساب بالفعل؟{" "}
            <Link href="/login" className="underline">
                تسجيل الدخول
            </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
