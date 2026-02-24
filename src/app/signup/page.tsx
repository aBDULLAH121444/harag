'use client';
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Car, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { Separator } from "@/components/ui/separator";

const signupSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "الاسم الأخير مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "يجب أن لا تقل كلمة المرور عن 6 أحرف"),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.301-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.688,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export default function SignupPage() {
    const router = useRouter();
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    });
    

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        if (!auth || !firestore) {
            toast({ variant: "destructive", title: "خطأ في التهيئة" });
            return;
        };
        setIsSubmitting(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            
            const fullName = `${values.firstName} ${values.lastName}`;
            await updateProfile(user, {
                displayName: fullName,
            });

            const userDocRef = doc(firestore, "users", user.uid);
            const userProfile = {
                id: user.uid,
                email: user.email,
                firstName: values.firstName,
                lastName: values.lastName,
                username: user.email?.split('@')[0],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            await setDoc(userDocRef, userProfile);

            toast({ title: "تم إنشاء الحساب بنجاح!" });
            router.push('/dashboard');

        } catch (error) {
            console.error("Signup Error:", error);
            let description = "حدث خطأ غير متوقع.";
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/email-already-in-use') {
                    description = "هذا البريد الإلكتروني مستخدم بالفعل.";
                } else {
                    description = "حدث خطأ أثناء إنشاء حسابك. يرجى المحاولة مرة أخرى.";
                }
            }
            toast({
                variant: "destructive",
                title: "فشل إنشاء الحساب",
                description,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleGoogleSignIn() {
        if (!auth || !firestore) {
            toast({ variant: "destructive", title: "خطأ في التهيئة", description: "لم يتم تهيئة خدمات Firebase بشكل صحيح." });
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                const [firstName, ...lastName] = (user.displayName || " ").split(" ");
                const userProfile = {
                    id: user.uid,
                    email: user.email,
                    firstName: firstName || "",
                    lastName: lastName.join(" ") || "",
                    username: user.email?.split('@')[0],
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                
                await setDoc(userDocRef, userProfile);
            }
            
            toast({ title: "تم تسجيل الدخول بنجاح!" });
            router.push('/dashboard');

        } catch (error) {
            console.error("Google Sign-In Error:", error);
            let description = "حدث خطأ أثناء تسجيل الدخول باستخدام جوجل.";
            if (error instanceof FirebaseError) {
                 if (error.code === 'auth/popup-closed-by-user') {
                    description = "تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.";
                } else if (error.code === 'auth/account-exists-with-different-credential') {
                    description = "يوجد حساب بالفعل بهذا البريد الإلكتروني ولكن ببيانات اعتماد مختلفة.";
                } else if (error.code === 'auth/operation-not-allowed') {
                    description = "تسجيل الدخول عبر جوجل غير مفعّل. يرجى تفعيله في لوحة تحكم Firebase.";
                }
            }
            toast({ variant: "destructive", title: "فشل إنشاء الحساب", description, });
        }
    }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
             <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                <Car className="h-10 w-10 text-primary" />
            </Link>
            <CardTitle className="text-2xl font-headline">إنشاء حساب</CardTitle>
            <CardDescription>
                أدخل معلوماتك لإنشاء حساب
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم الأول</FormLabel>
                                <FormControl>
                                    <Input placeholder="أحمد" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم الأخير</FormLabel>
                                <FormControl>
                                    <Input placeholder="علي" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
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
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        إنشاء حساب
                    </Button>
                </form>
            </Form>
            
            <div className="relative my-4">
                <Separator />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-card text-sm text-muted-foreground">أو</div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon className="mr-2 h-5 w-5"/>
                إنشاء حساب باستخدام جوجل
            </Button>


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
