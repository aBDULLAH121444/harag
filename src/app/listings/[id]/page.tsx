import { getListingById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Tag, Gauge, MapPin, Calendar, Wrench, CheckCircle, Phone } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52s-.67-.166-.916-.234c-.246-.067-.52.005-.765.116-.245.111-.967.462-1.206.887-.238.424-.52.887-.52 1.547 0 .659.297 1.253.372 1.352.075.098.52 1.096 2.474 2.825.467.422.834.636 1.12.723.286.087.56.075.765-.025.224-.111.967-.448 1.164-.94.197-.492.197-.918.148-1.017-.049-.098-.197-.148-.446-.273zM12.072 2.01C6.58 2.01 2.125 6.464 2.125 11.95c0 1.798.465 3.493 1.28 4.96l-1.35 4.938 5.06-1.332c1.41.772 3.003 1.21 4.686 1.21h.004c5.49 0 9.945-4.455 9.945-9.942 0-5.487-4.455-9.943-9.945-9.943zM12.072 21.455h-.004c-1.842 0-3.593-.506-5.097-1.4l-.367-.217-3.784.99 1.008-3.69-.24-.39c-.933-1.543-1.448-3.37-1.448-5.263 0-4.628 3.76-8.39 8.388-8.39 4.628 0 8.388 3.762 8.388 8.39 0 4.628-3.76 8.39-8.388 8.39z" fill="currentColor"/>
    </svg>
);


export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const car = await getListingById(params.id);

  if (!car) {
    notFound();
  }
  
  const whatsappNumber = car.seller.phoneNumber?.replace('+', '');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4">{car.make} {car.model} {car.year}</h1>
      
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
                    <div className="flex items-center gap-2 text-2xl font-semibold text-accent">
                        <Tag className="w-6 h-6 ml-2" />
                        <span>{car.price.toLocaleString()} {car.currency}</span>
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
                    <CardTitle>معلومات البائع</CardTitle>
                </CardHeader>
                <CardContent>
                    <Link href={`/seller/${car.userId}`} className="block group rounded-lg p-2 -m-2 transition-colors hover:bg-accent/50">
                        <div>
                            <p className="font-bold text-lg group-hover:text-primary">{car.seller.name}</p>
                            <p className="text-sm text-muted-foreground">عضو منذ {format(car.seller.joinedAt, 'MMMM yyyy', { locale: arSA })}</p>
                        </div>
                    </Link>
                </CardContent>
            </Card>
            
            {car.seller.phoneNumber && (
                <div className="space-y-3">
                     <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                            <WhatsAppIcon className="ml-2 h-5 w-5" />
                            تواصل عبر واتساب
                        </Button>
                    </a>
                    <a href={`tel:${car.seller.phoneNumber}`} className="w-full">
                        <Button size="lg" variant="outline" className="w-full">
                            <Phone className="ml-2 h-4 w-4" />
                            اتصال: {car.seller.phoneNumber}
                        </Button>
                    </a>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
