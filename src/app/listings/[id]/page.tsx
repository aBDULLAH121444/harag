import { getListingById, getImageById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';
import { Tag, Gauge, MapPin, Calendar, Wrench, CheckCircle, MessageSquare } from 'lucide-react';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const car = getListingById(params.id);

  if (!car) {
    notFound();
  }
  
  const sellerAvatar = getImageById(car.seller.avatarId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Carousel className="w-full rounded-lg overflow-hidden shadow-lg">
                <CarouselContent>
                    {car.images.map((img, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-video relative">
                            <Image
                                src={img.url}
                                alt={`${car.make} ${car.model} image ${index + 1}`}
                                fill
                                className="object-cover"
                                data-ai-hint={img.hint}
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
                    <CardTitle>Description</CardTitle>
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
                        <Tag className="w-6 h-6" />
                        <span>{car.price.toLocaleString()} SAR</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/> Posted</span>
                        <span>{formatDistanceToNow(car.postedAt, { addSuffix: true })}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4"/> Location</span>
                        <span className="font-medium">{car.location}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Gauge className="w-4 h-4"/> Mileage</span>
                        <span className="font-medium">{car.mileage.toLocaleString()} km</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Wrench className="w-4 h-4"/> Condition</span>
                        <Badge variant="secondary">{car.condition}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                        {car.features.map(feature => (
                            <li key={feature} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        {sellerAvatar && <AvatarImage src={sellerAvatar.imageUrl} alt={car.seller.name} data-ai-hint={sellerAvatar.imageHint} />}
                        <AvatarFallback>{car.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-lg">{car.seller.name}</p>
                        <p className="text-sm text-muted-foreground">Member since {format(new Date(2021, 5, 1), 'MMMM yyyy')}</p>
                    </div>
                </CardContent>
            </Card>
            <Button size="lg" className="w-full">
                <MessageSquare className="mr-2 h-5 w-5"/> Contact Seller
            </Button>
        </div>

      </div>
    </div>
  );
}
