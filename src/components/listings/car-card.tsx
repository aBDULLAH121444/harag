import type { Car } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gauge, MapPin, Calendar, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type CarCardProps = {
  car: Car;
};

export default function CarCard({ car }: CarCardProps) {
  const firstImage = car.images[0];

  return (
    <Link href={`/listings/${car.id}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0 relative">
          <Image
            src={firstImage.url}
            alt={`${car.make} ${car.model}`}
            width={600}
            height={400}
            className="aspect-video object-cover"
            data-ai-hint={firstImage.hint}
          />
          <Badge variant="secondary" className="absolute top-2 right-2">{car.condition}</Badge>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">
            {car.make} {car.model}
          </CardTitle>
          <div className="mt-2 text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent" />
              <span className="font-semibold text-base text-primary">{car.price.toLocaleString()} SAR</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span>{car.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{car.location}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Posted {formatDistanceToNow(car.postedAt, { addSuffix: true })}</span>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
