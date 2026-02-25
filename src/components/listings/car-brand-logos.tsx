'use client';
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

const ToyotaLogo = ({ className }: LogoProps) => (
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_logo.svg/1280px-Toyota_logo.svg.png"
    alt="Toyota Logo"
    width={1280}
    height={800}
    className={className}
    priority
  />
);

const HyundaiLogo = ({ className }: LogoProps) => (
    <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Hyundai_logo_2.svg/1280px-Hyundai_logo_2.svg.png"
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

const MercedesLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Mercedes-Benz_text_logo.svg/2560px-Mercedes-Benz_text_logo.svg.png"
      alt="Mercedes-Benz Logo"
      width={2560}
      height={341}
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

const NissanLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Nissan-logo.png/600px-Nissan-logo.png"
      alt="Nissan Logo"
      width={600}
      height={116}
      className={className}
      priority
    />
);

const KiaLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/KIA_logo2.svg/2560px-KIA_logo2.svg.png"
      alt="Kia Logo"
      width={2560}
      height={508}
      className={className}
      priority
    />
);

const LexusLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Lexus_division_wordmark.svg/2560px-Lexus_division_wordmark.svg.png"
      alt="Lexus Logo"
      width={2560}
      height={384}
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
