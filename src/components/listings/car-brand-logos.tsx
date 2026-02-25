'use client';
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const brandNameToIdMap: Record<string, string> = {
    "تويوتا": "logo-toyota",
    "هيونداي": "logo-hyundai",
    "فورد": "logo-ford",
    "مرسيدس بنز": "logo-mercedes-benz",
    "بي إم دبليو": "logo-bmw",
    "نيسان": "logo-nissan",
    "كيا": "logo-kia",
    "لكزس": "logo-lexus",
    "شيفروليه": "logo-chevrolet",
};

const logoMap = new Map(PlaceHolderImages.filter(img => img.id.startsWith('logo-')).map(img => [img.id, img]));

type CarBrandLogoProps = {
    brand: string;
    className?: string;
};

export const CarBrandLogo = ({ brand, className }: CarBrandLogoProps) => {
  const logoId = brandNameToIdMap[brand];
  const logoData = logoId ? logoMap.get(logoId) : undefined;

  if (!logoData) {
    return <span className={cn("text-xs font-bold", className)}>{brand}</span>;
  }

  return (
    <div className={cn("relative h-full w-full flex items-center justify-center overflow-hidden", className)}>
      <Image
        src={logoData.imageUrl}
        alt={logoData.description}
        fill
        className="object-contain p-0.5"
        data-ai-hint={logoData.imageHint}
        unoptimized 
      />
    </div>
  );
};
