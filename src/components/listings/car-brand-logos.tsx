'use client';
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

// Use a darker logo for better visibility
const ToyotaLogo = ({ className }: LogoProps) => (
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Toyota_T_emblem.svg/1200px-Toyota_T_emblem.svg.png"
    alt="Toyota Logo"
    width={100}
    height={100}
    className={className}
    priority
  />
);

// Use a more visible logo
const HyundaiLogo = ({ className }: LogoProps) => (
    <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Hyundai_logo.png/600px-Hyundai_logo.png"
        alt="Hyundai Logo"
        width={1280}
        height={333}
        className={className}
        priority
    />
);

const FordLogo = ({ className }: LogoProps) => (
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1200px-Ford_logo_flat.svg.png"
    alt="Ford Logo"
    width={1200}
    height={450}
    className={className}
    priority
  />
);

// Use a darker logo for better visibility
const MercedesLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mercedes-Benz_logo_content.svg/1200px-Mercedes-Benz_logo_content.svg.png"
      alt="Mercedes-Benz Logo"
      width={100}
      height={100}
      className={className}
      priority
    />
);

const BMWLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png"
      alt="BMW Logo"
      width={100}
      height={100}
      className={className}
      priority
    />
);

// Use a darker logo for better visibility
const NissanLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.svg/1280px-Nissan_logo.svg.png"
      alt="Nissan Logo"
      width={1280}
      height={293}
      className={className}
      priority
    />
);

// Use a larger, clearer version
const KiaLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Kia_logo_2.svg/2560px-Kia_logo_2.svg.png"
      alt="Kia Logo"
      width={320}
      height={63}
      className={className}
      priority
    />
);

// Use a darker logo for better visibility
const LexusLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Lexus_logo.svg/1280px-Lexus_logo.svg.png"
      alt="Lexus Logo"
      width={320}
      height={228}
      className={className}
      priority
    />
);

const ChevroletLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Chevrolet-logo.png/1200px-Chevrolet-logo.png"
      alt="Chevrolet Logo"
      width={1200}
      height={311}
      className={className}
      priority
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
