'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type ListingGalleryProps = {
  images: ImagePlaceholder[];
  carName: string;
};

export default function ListingGallery({ images, carName }: ListingGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);
  const [zoom, setZoom] = useState(1);
  
  const handleClose = () => {
    setSelectedImage(null);
    setZoom(1);
  };

  return (
    <>
      <Carousel className="w-full rounded-lg overflow-hidden shadow-lg" dir="ltr">
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index} onClick={() => setSelectedImage(img)} className="cursor-pointer">
              <div className="aspect-video relative">
                <Image
                  src={img.imageUrl}
                  alt={`${carName} image ${index + 1}`}
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

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="relative w-full h-full p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
               <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                 <ZoomIn className="w-6 h-6" />
               </button>
               <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                 <ZoomOut className="w-6 h-6" />
               </button>
               <button onClick={() => setZoom(1)} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                 <RotateCcw className="w-5 h-5" />
               </button>
               <button onClick={handleClose} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            {/* Image Container for zooming */}
            <div className="w-full h-full overflow-auto">
                <div 
                    className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <Image
                      src={selectedImage.imageUrl}
                      alt={`Enlarged view of ${selectedImage.description}`}
                      fill
                      className="object-contain"
                      data-ai-hint={selectedImage.imageHint}
                    />
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
