import Link from 'next/link';
import { Car, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary font-headline tracking-tight">
            حراج اليمن
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">لوحة التحكم</Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/sell">
              <PlusCircle className="ml-2 h-4 w-4" />
              بع سيارتك
            </Link>
          </Button>
          <div className="hidden md:flex items-center gap-2">
             <Button variant="outline" asChild>
                <Link href="/login">تسجيل الدخول</Link>
             </Button>
             <Button asChild>
                <Link href="/signup">إنشاء حساب</Link>
             </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
