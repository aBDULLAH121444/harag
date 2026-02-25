import { getUserListings, getUserProfile } from '@/lib/data';
import { notFound } from 'next/navigation';
import CarCard from '@/components/listings/car-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';


type UserProfileData = {
    firstName: string;
    lastName: string;
    username: string;
    photoURL?: string;
    createdAt: Timestamp;
};


export default async function SellerPage({ params }: { params: { userId: string } }) {
    const { userId } = params;
    
    const [userProfile, userListings] = await Promise.all([
        getUserProfile(userId),
        getUserListings(userId)
    ]);

    if (!userProfile) {
        notFound();
    }
    
    const profile = userProfile as UserProfileData;
    const sellerName = `${profile.firstName} ${profile.lastName}`.trim() || profile.username;
    
    const joinDate = profile.createdAt ? profile.createdAt.toDate() : new Date(2021, 5, 1);

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex items-center gap-4">
                         <Avatar className="h-20 w-20">
                            {profile.photoURL ? (
                                <AvatarImage src={profile.photoURL} alt={sellerName} />
                            ) : (
                                <AvatarImage src="https://images.unsplash.com/photo-1624395213043-fa2e123b2656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzE5Mzk5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt={sellerName} data-ai-hint="man portrait" />
                            )}
                            <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold font-headline text-primary">{sellerName}</h1>
                            <p className="text-muted-foreground">عضو منذ {format(joinDate, 'MMMM yyyy', { locale: arSA })}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <h2 className="text-2xl font-bold mb-6">إعلانات {sellerName} ({userListings.length})</h2>

            {userListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userListings.map((listing) => (
                        <CarCard key={listing.id} car={listing} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-lg">
                    <h3 className="text-xl font-bold">لا توجد إعلانات</h3>
                    <p className="text-muted-foreground mt-2">هذا المستخدم لم يقم بنشر أي إعلانات بعد.</p>
                </div>
            )}
        </div>
    );
}
