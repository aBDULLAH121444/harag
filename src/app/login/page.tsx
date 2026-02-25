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
import { useAuth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^7[01378]\d{7}$/, "يرجى إدخال رقم هاتف يمني صالح يبدأ بـ 7"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "يجب أن يكون الرمز مكونًا من 6 أرقام"),
});

export default function LoginPage() {
    const router = useRouter();
    const auth = useAuth();
    const { toast } = useToast();
    
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const phoneForm = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phoneNumber: "" },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    useEffect(() => {
        if (!auth || (window as any).recaptchaVerifier) return;
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          }
        });
        return () => {
            if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
            }
        };
    }, [auth]);

    async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
        if (!auth) {
        toast({ variant: "destructive", title: "خطأ في التهيئة" });
        return;
        }
        setIsSubmitting(true);
        try {
        const formattedPhoneNumber = `+967${values.phoneNumber}`;
        const appVerifier = (window as any).recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
        setConfirmationResult(confirmation);
        setStep('otp');
        toast({ title: "تم إرسال الرمز", description: `تم إرسال رمز التحقق إلى ${formattedPhoneNumber}` });
        } catch (error) {
        console.error(error);
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
        if (!confirmationResult) {
        toast({ variant: "destructive", title: "خطأ", description: "لم يتم العثور على نتيجة التحقق." });
        return;
        }
        setIsSubmitting(true);
        try {
        await confirmationResult.confirm(values.otp);
        toast({ title: "تم تسجيل الدخول بنجاح!" });
        router.push('/dashboard');
        } catch (error) {
        console.error(error);
        let description = "حدث خطأ غير متوقع.";
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/invalid-verification-code') {
            description = "رمز التحقق الذي أدخلته غير صحيح.";
            }
        }
        toast({ variant: "destructive", title: "فشل تسجيل الدخول", description });
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
            <CardTitle className="text-2xl font-headline">تسجيل الدخول</CardTitle>
            <CardDescription>
                {step === 'phone' ? 'أدخل رقم هاتفك اليمني لتسجيل الدخول' : 'أدخل الرمز الذي تم إرساله إلى هاتفك'}
            </CardDescription>
            </CardHeader>
            <CardContent>
            {step === 'phone' ? (
                <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                    <FormField
                    control={phoneForm.control}
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
                    إرسال رمز التحقق
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
                    تسجيل الدخول
                    </Button>
                </form>
                </Form>
            )}
            <div id="recaptcha-container"></div>
            <div className="mt-4 text-center text-sm">
                ليس لديك حساب؟{" "}
                <Link href="/signup" className="underline">
                إنشاء حساب
                </Link>
            </div>
            </CardContent>
        </Card>
        </div>
    )
}

    