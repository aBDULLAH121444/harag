'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Car, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile, type ConfirmationResult } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const signupSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phoneNumber: z.string().regex(/^7[01378]\d{7}$/, "يرجى إدخال رقم هاتف يمني صالح يبدأ بـ 7 (9 أرقام)"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "يجب أن يكون الرمز مكونًا من 6 أرقام"),
});

export default function SignupPage() {
    const router = useRouter();
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formValues, setFormValues] = useState<z.infer<typeof signupSchema> | null>(null);
    
    const detailsForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", phoneNumber: "" },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    useEffect(() => {
        if (!auth || (window as any).recaptchaVerifier) return;
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {},
        });
        return () => {
            if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
            }
        };
      }, [auth]);

    async function onDetailsSubmit(values: z.infer<typeof signupSchema>) {
        if (!auth) {
            toast({ variant: "destructive", title: "خطأ في التهيئة" });
            return;
        };
        setIsSubmitting(true);
        setFormValues(values);

        try {
            const formattedPhoneNumber = `+967${values.phoneNumber}`;
            const appVerifier = (window as any).recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
            
            setConfirmationResult(confirmation);
            setStep('otp');
            toast({ title: "تم إرسال الرمز", description: `تم إرسال رمز التحقق إلى ${formattedPhoneNumber}` });
        } catch (error) {
            console.error("Phone Sign-In Error:", error);
            let description = "حدث خطأ غير متوقع.";
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/invalid-phone-number') {
                    description = "رقم الهاتف الذي أدخلته غير صالح.";
                } else if (error.code === 'auth/too-many-requests') {
                    description = "تم إرسال عدد كبير جدًا من الطلبات. يرجى المحاولة مرة أخرى لاحقًا.";
                }
            }
            toast({ variant: "destructive", title: "فشل إرسال الرمز", description });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
        if (!confirmationResult || !formValues || !firestore) {
            toast({ variant: "destructive", title: "خطأ", description: "بيانات النموذج أو التحقق غير موجودة." });
            return;
        }
        setIsSubmitting(true);
        try {
            const userCredential = await confirmationResult.confirm(values.otp);
            const user = userCredential.user;
            
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await updateProfile(user, { displayName: formValues.name });
                
                const userProfile = {
                    id: user.uid,
                    name: formValues.name,
                    email: formValues.email,
                    phoneNumber: formValues.phoneNumber,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };
                await setDoc(userDocRef, userProfile);
            }

            toast({ title: "تم إنشاء الحساب بنجاح!" });
            router.push('/dashboard');

        } catch (error) {
            console.error("OTP Confirmation Error:", error);
            let description = "حدث خطأ غير متوقع.";
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/invalid-verification-code') {
                    description = "رمز التحقق الذي أدخلته غير صحيح.";
                } else if (error.code === 'auth/account-exists-with-different-credential') {
                    description = "يوجد حساب بالفعل بهذا الرقم.";
                }
            }
            toast({ variant: "destructive", title: "فشل إنشاء الحساب", description });
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
            <CardTitle className="text-2xl font-headline">إنشاء حساب</CardTitle>
            <CardDescription>
            {step === 'details' ? 'أدخل معلوماتك لإنشاء حساب' : 'أدخل الرمز الذي تم إرساله إلى هاتفك'}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {step === 'details' ? (
            <Form {...detailsForm}>
                <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-4">
                     <FormField
                        control={detailsForm.control}
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
                        control={detailsForm.control}
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
                        control={detailsForm.control}
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
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        إنشاء حساب
                    </Button>
                </form>
            </Form>
            ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز التحقق</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} type="number" className="text-center" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  تحقق وإنشاء الحساب
                </Button>
              </form>
            </Form>
            )}
            
            <div id="recaptcha-container"></div>

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

    