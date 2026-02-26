import type { Car } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gauge, MapPin, Calendar, Tag, Car as CarIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';

type CarCardProps = {
  car: Car;
};

export default function CarCard({ car }: CarCardProps) {
  const firstImage = car.images?.[0];

  return (
    <Link href={`/listings/${car.id}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-0 relative">
          {firstImage ? (
            <Image
              src={firstImage.imageUrl}
              alt={`${car.make} ${car.model}`}
              width={600}
              height={400}
              className="aspect-[4/3] object-cover"
              data-ai-hint={firstImage.imageHint}
            />
          ) : (
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <CarIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] py-0 px-2">{car.condition}</Badge>
          <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
            <h3 className="text-white font-bold text-sm leading-tight">
              {car.make} {car.model} {car.year}
            </h3>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-primary">{car.price.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground">{car.currency}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-accent" />
              <span>{car.mileage.toLocaleString()} كم</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-accent" />
              <span className="truncate">{car.location}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 text-[10px] text-muted-foreground border-t border-gray-50 mt-1">
            <div className="flex items-center gap-1 mt-2">
                <Calendar className="w-3 h-3" />
                <span>قبل {formatDistanceToNow(car.postedAt, { locale: arSA })}</span>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
