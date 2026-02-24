'use client'; // Make it a client component

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase'; // Use our new hook
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getUserListings } from "@/lib/data";
import { MoreHorizontal, Pencil, Trash2, Car as CarIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { arSA } from "date-fns/locale";
import { format } from "date-fns";
import type { Car } from '@/lib/types'; // Import Car type

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const [userListings, setUserListings] = useState<Car[]>([]);
    const [isLoadingListings, setIsLoadingListings] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoadingListings(true);
            getUserListings(user.uid)
                .then(listings => {
                    setUserListings(listings);
                    setIsLoadingListings(false);
                })
                .catch(error => {
                    console.error("Error fetching user listings:", error);
                    setIsLoadingListings(false);
                });
        } else if (!isUserLoading) {
            // Not logged in
            setIsLoadingListings(false);
            setUserListings([]);
        }
    }, [user, isUserLoading]);

    if (isUserLoading || isLoadingListings) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-20rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        return (
             <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold">يرجى تسجيل الدخول</h1>
                <p className="text-muted-foreground mt-2">يجب عليك تسجيل الدخول لعرض لوحة التحكم الخاصة بك.</p>
                <Button asChild className="mt-4">
                    <Link href="/login">تسجيل الدخول</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary font-headline">
                    لوحة التحكم الخاصة بي
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    إدارة قوائم سياراتك وإعدادات حسابك.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>قوائمي</CardTitle>
                    <CardDescription>لديك {userListings.length} من القوائم.</CardDescription>
                </CardHeader>
                <CardContent>
                    {userListings.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">لم تقم بإضافة أي قوائم حتى الآن.</p>
                             <Button asChild className="mt-4">
                                <Link href="/sell">إنشاء قائمة جديدة</Link>
                            </Button>
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">صورة</TableHead>
                                <TableHead>السيارة</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead className="hidden md:table-cell">السعر</TableHead>
                                <TableHead className="hidden md:table-cell">نشرت في</TableHead>
                                <TableHead>
                                    <span className="sr-only">الإجراءات</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userListings.map(listing => {
                                const firstImage = listing.images?.[0];
                                return (
                                <TableRow key={listing.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {firstImage ? (
                                            <Image
                                                alt={`${listing.make} ${listing.model}`}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={firstImage.imageUrl}
                                                width="64"
                                                data-ai-hint={firstImage.imageHint}
                                            />
                                        ) : (
                                            <div className="aspect-square h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                                                <CarIcon className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="font-bold">{listing.year} {listing.make} {listing.model}</div>
                                        <div className="text-sm text-muted-foreground">{listing.location}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">نشط</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{listing.price.toLocaleString()} ريال سعودي</TableCell>
                                    <TableCell className="hidden md:table-cell">{format(listing.postedAt, 'P', { locale: arSA })}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                            <DropdownMenuItem asChild><Link href={`/sell?edit=${listing.id}`} className="flex items-center"><Pencil className="ml-2 h-4 w-4"/> تعديل</Link></DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 flex items-center"><Trash2 className="ml-2 h-4 w-4"/> حذف</DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
