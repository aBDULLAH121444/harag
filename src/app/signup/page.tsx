import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car } from "lucide-react"

export default function SignupPage() {
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
            <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">الاسم الكامل</Label>
                <Input id="full-name" placeholder="أحمد علي" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
                إنشاء حساب
            </Button>
            </div>
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
