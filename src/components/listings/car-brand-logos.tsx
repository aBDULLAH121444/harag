'use client';
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

// All logos are now hosted on Cloudinary for reliability.

const ToyotaLogo = ({ className }: LogoProps) => (
  <Image
    src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285000/haraj-yemen-logos/toyota_logo.png"
    alt="Toyota Logo"
    width={1280}
    height={800}
    className={className}
  />
);

const HyundaiLogo = ({ className }: LogoProps) => (
    <Image
        src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285001/haraj-yemen-logos/hyundai_logo.png"
        alt="Hyundai Logo"
        width={1280}
        height={333}
        className={className}
    />
);

const FordLogo = ({ className }: LogoProps) => (
  <Image
    src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285002/haraj-yemen-logos/ford_logo.png"
    alt="Ford Logo"
    width={1200}
    height={450}
    className={className}
  />
);

const MercedesLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285003/haraj-yemen-logos/mercedes_logo.png"
      alt="Mercedes-Benz Logo"
      width={2560}
      height={341}
      className={className}
    />
);

const BMWLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285004/haraj-yemen-logos/bmw_logo.png"
      alt="BMW Logo"
      width={100}
      height={100}
      className={className}
    />
);

const NissanLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285005/haraj-yemen-logos/nissan_logo.png"
      alt="Nissan Logo"
      width={600}
      height={116}
      className={className}
    />
);

const KiaLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285006/haraj-yemen-logos/kia_logo.png"
      alt="Kia Logo"
      width={2560}
      height={508}
      className={className}
    />
);

const LexusLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285007/haraj-yemen-logos/lexus_logo.png"
      alt="Lexus Logo"
      width={2560}
      height={384}
      className={className}
    />
);

const ChevroletLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1722285008/haraj-yemen-logos/chevrolet_logo.png"
      alt="Chevrolet Logo"
      width={1200}
      height={311}
      className={className}
    />
);


const logos: Record<string, React.FC<LogoProps>> = {
  "تويوتا": ToyotaLogo,
  "هيونداي": HyundaiLogo,
  "فورد": FordLogo,
  "مرسيدس بنز": MercedesLogo,
  "بي إم دبليو": BMWLogo,
  "نيسان": NissanLogo,
  "كيا": KiaLogo,
  "لكزس": LexusLogo,
  "شيفروليه": ChevroletLogo,
};

type CarBrandLogoProps = {
    brand: string;
    className?: string;
};

export const CarBrandLogo = ({ brand, className }: CarBrandLogoProps) => {
  const LogoComponent = logos[brand];

  if (!LogoComponent) {
    return <span className={cn("text-sm", className)}>{brand}</span>;
  }

  return <LogoComponent className={cn("h-full w-auto object-contain", className)} />;
};
