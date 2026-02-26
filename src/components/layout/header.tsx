'use client';

import Link from 'next/link';
import { Car, LogOut, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[1]) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40 h-14 md:h-16">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <span className="text-lg md:text-xl font-bold text-primary font-headline tracking-tight">
            حراج اليمن
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {isUserLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <>
              {!isMobile && (
                <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground ml-2">
                  <Link href="/sell">
                    أضف إعلان
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full p-0">
                    <Avatar className="h-full w-full">
                      {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || ''} />}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      <span>لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
