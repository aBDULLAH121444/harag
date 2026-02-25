'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";

const loginSchema = z.object({
  phoneNumber: z.string().regex(/^7[01378]\d{7}$/, "يرجى إدخال رقم هاتف يمني صالح (9 أرقام تبدأ بـ 7)"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور 6 أحرف على الأقل"),
});

// Helper to create the fake email
const createFakeEmailFromPhone = (phone: string) => `+967${phone}@haraj-yemen.app`;

export default function LoginPage() {
    const router = useRouter();
    const auth = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { phoneNumber: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        if (!auth) {
            toast({ variant: "destructive", title: "خطأ في التهيئة" });
            return;
        }
        setIsSubmitting(true);
        try {
            const fakeEmail = createFakeEmailFromPhone(values.phoneNumber);
            await signInWithEmailAndPassword(auth, fakeEmail, values.password);
            toast({ title: "تم تسجيل الدخول بنجاح!" });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            let description = "رقم الهاتف أو كلمة المرور غير صحيحة.";
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    description = "رقم الهاتف أو كلمة المرور غير صحيحة.";
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
                        أدخل رقم هاتفك وكلمة المرور للمتابعة
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                تسجيل الدخول
                            </Button>
                        </form>
                    </Form>
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
