import { getListingById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Tag, Gauge, MapPin, Calendar, Wrench, CheckCircle, MessageSquare, Phone } from 'lucide-react';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const car = await getListingById(params.id);

  if (!car) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Carousel className="w-full rounded-lg overflow-hidden shadow-lg" dir="ltr">
                <CarouselContent>
                    {car.images.map((img, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-video relative">
                            <Image
                                src={img.imageUrl}
                                alt={`${car.make} ${car.model} image ${index + 1}`}
                                fill
                                className="object-cover"
                                data-ai-hint={img.imageHint}
                                priority={index === 0}
                            />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>الوصف</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{car.description}</p>
                </CardContent>
            </Card>

        </div>
        
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <h1 className="text-3xl font-bold font-headline text-primary">{car.year} {car.make} {car.model}</h1>
                    <div className="flex items-center gap-2 text-2xl font-semibold text-accent pt-2">
                        <Tag className="w-6 h-6 ml-2" />
                        <span>{car.price.toLocaleString()} ريال سعودي</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4 ml-2"/> نشرت</span>
                        <span>{formatDistanceToNow(car.postedAt, { addSuffix: true, locale: arSA })}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4 ml-2"/> الموقع</span>
                        <span className="font-medium">{car.location}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Gauge className="w-4 h-4 ml-2"/> المسافة المقطوعة</span>
                        <span className="font-medium">{car.mileage.toLocaleString()} كم</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Wrench className="w-4 h-4 ml-2"/> الحالة</span>
                        <Badge variant="secondary">{car.condition}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>الميزات</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                        {car.features.map(feature => (
                            <li key={feature} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>معلومات البائع</CardTitle>
                </CardHeader>
                <CardContent>
                    <Link href={`/seller/${car.userId}`} className="flex items-center gap-4 group rounded-lg p-2 -m-2 transition-colors hover:bg-accent/50">
                        <Avatar className="h-16 w-16">
                            {car.seller.avatarUrl ? (
                                <AvatarImage src={car.seller.avatarUrl} alt={car.seller.name} />
                            ) : (
                                <AvatarImage src="https://images.unsplash.com/photo-1624395213043-fa2e123b2656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NzE5Mzk5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt={car.seller.name} data-ai-hint="man portrait" />
                            )}
                            <AvatarFallback>{car.seller.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-lg group-hover:text-primary">{car.seller.name}</p>
                            <p className="text-sm text-muted-foreground">عضو منذ {format(new Date(2021, 5, 1), 'MMMM yyyy', { locale: arSA })}</p>
                        </div>
                    </Link>
                    {car.seller.phoneNumber && (
                        <div className="mt-4">
                            <a href={`tel:${car.seller.phoneNumber}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                    <Phone className="ml-2 h-4 w-4" />
                                    {car.seller.phoneNumber}
                                </Button>
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Button size="lg" className="w-full">
                <MessageSquare className="ml-2 h-5 w-5"/> تواصل مع البائع
            </Button>
        </div>

      </div>
    </div>
  );
}
