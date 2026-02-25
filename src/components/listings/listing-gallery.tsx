'use client';

import { useState, useRef, type TouchEvent, type WheelEvent, type MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { X } from 'lucide-react';

type ListingGalleryProps = {
  images: ImagePlaceholder[];
  carName: string;
};

export default function ListingGallery({ images, carName }: ListingGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const initialDistance = useRef<number | null>(null);
  const initialZoom = useRef<number>(1);
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleClose = () => {
    setSelectedImage(null);
    // Reset state on close
    setZoom(1);
    setPan({ x: 0, y: 0 });
    initialDistance.current = null;
    initialZoom.current = 1;
    isDragging.current = false;
  };

  useEffect(() => {
    // Reset pan when zoom is back to 1
    if (zoom <= 1) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoom]);
  
  // Add keydown listener for Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (selectedImage) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);


  // Touch handlers for pinch-to-zoom and one-finger pan
  const getDistance = (touches: TouchList) => {
    return Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      isDragging.current = false; // Prioritize zoom
      initialDistance.current = getDistance(e.touches);
      initialZoom.current = zoom;
    } else if (e.touches.length === 1 && zoom > 1) {
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = { 
        x: e.touches[0].clientX - pan.x, 
        y: e.touches[0].clientY - pan.y 
      };
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialDistance.current !== null) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const newZoom = initialZoom.current * (newDistance / initialDistance.current);
      setZoom(Math.max(1, Math.min(newZoom, 5)));
    } else if (e.touches.length === 1 && isDragging.current) {
      e.preventDefault();
      const newX = e.touches[0].clientX - dragStart.current.x;
      const newY = e.touches[0].clientY - dragStart.current.y;
      setPan({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    initialDistance.current = null;
    isDragging.current = false;
  };

  // Mouse handlers for wheel-zoom and drag-to-pan
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.005;
    setZoom(Math.max(1, Math.min(newZoom, 5)));
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (zoom > 1) {
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = { 
        x: e.clientX - pan.x, 
        y: e.clientY - pan.y 
      };
      (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging.current && zoom > 1) {
      e.preventDefault();
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      setPan({ x: newX, y: newY });
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (zoom > 1) {
      (e.currentTarget as HTMLElement).style.cursor = 'grab';
    }
  };

   const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      isDragging.current = false;
      if (zoom > 1) {
        (e.currentTarget as HTMLElement).style.cursor = 'grab';
      }
    }
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
            className="relative w-full h-full"
            style={{ cursor: zoom > 1 ? 'grab' : 'auto', touchAction: 'none' }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
               <button onClick={handleClose} className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            {/* Image Container for zooming and panning */}
            <div
                className="relative transition-transform duration-100 ease-out"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
            >
                <Image
                  src={selectedImage.imageUrl}
                  alt={`Enlarged view of ${selectedImage.description}`}
                  fill
                  className="object-contain"
                  data-ai-hint={selectedImage.imageHint}
                  draggable="false" // prevent native image drag
                />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
