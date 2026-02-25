'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Car as CarIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { arSA } from "date-fns/locale";
import { format } from "date-fns";
import type { Car } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [listingToDelete, setListingToDelete] = useState<string | null>(null);

    const userListingsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'carListings'), where('userId', '==', user.uid));
    }, [user, firestore]);
    
    const { data: rawListings, isLoading: isLoadingListings, error } = useCollection(userListingsQuery);
    
    const userListings = useMemo(() => {
      if (!rawListings) return [];

      const listings: Car[] = rawListings.map((data: any) => {
        const images = (data.images || []).map((url: string, index: number) => {
            const found = PlaceHolderImages.find(p => p.imageUrl === url);
            if (found) return found;
            
            return {
                id: `fb-img-${data.id}-${index}`,
                imageUrl: url,
                description: `${data.make} ${data.model}`,
                imageHint: `${data.make.toLowerCase()} ${data.model.toLowerCase()}`
            };
        });

        return {
            id: data.id,
            userId: data.userId,
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            currency: data.currency || 'ريال سعودي',
            mileage: data.mileage,
            location: data.location,
            description: data.description,
            features: data.features || [],
            images: images,
            seller: {
                name: user?.displayName || 'مستخدم غير معروف',
                joinedAt: user?.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
            },
            postedAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
            condition: data.condition,
            status: data.status,
        };
      });
      
      listings.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
      return listings;
    }, [rawListings, user]);

    const handleDelete = async () => {
        if (!listingToDelete || !firestore) return;
        try {
            await deleteDoc(doc(firestore, 'carListings', listingToDelete));
            toast({
                title: 'تم الحذف',
                description: 'تم حذف الإعلان بنجاح.',
            });
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast({
                variant: 'destructive',
                title: 'خطأ',
                description: 'فشل حذف الإعلان. الرجاء معاودة المحاولة.',
            });
        } finally {
            setListingToDelete(null);
        }
    };
    
    if (error) {
        console.error("Error fetching user listings:", error);
    }
    
    if (isUserLoading || (user && isLoadingListings)) {
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
        <>
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
                                        <TableCell className="hidden md:table-cell">{listing.price.toLocaleString()} {listing.currency}</TableCell>
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
                                                <DropdownMenuItem asChild><Link href={`/sell?edit=${listing.id}`} className="flex items-center cursor-pointer"><Pencil className="ml-2 h-4 w-4"/> تعديل</Link></DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setListingToDelete(listing.id)} className="text-red-600 focus:text-red-600 flex items-center cursor-pointer"><Trash2 className="ml-2 h-4 w-4"/> حذف</DropdownMenuItem>
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
            <AlertDialog open={!!listingToDelete} onOpenChange={(open) => !open && setListingToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                        <AlertDialogDescription>
                            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف إعلانك بشكل دائم.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">حذف</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
