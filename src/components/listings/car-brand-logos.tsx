'use client';
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

const ToyotaLogo = ({ className }: LogoProps) => (
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Toyota_EU.svg/2560px-Toyota_EU.svg.png"
    alt="Toyota Logo"
    width={100}
    height={67}
    className={className}
    priority
  />
);

const HyundaiLogo = ({ className }: LogoProps) => (
    <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Hyundai_motor_company_logo.svg/2560px-Hyundai_motor_company_logo.svg.png"
        alt="Hyundai Logo"
        width={2560}
        height={667}
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
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Benz_Logo_2010.svg/1200px-Mercedes-Benz_Logo_2010.svg.png"
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

const NissanLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Nissan_logo.svg/1200px-Nissan_logo.svg.png"
      alt="Nissan Logo"
      width={1200}
      height={290}
      className={className}
      priority
    />
);

const KiaLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kia-logo.svg/1280px-Kia-logo.svg.png"
      alt="Kia Logo"
      width={1280}
      height={252}
      className={className}
      priority
    />
);

const LexusLogo = ({ className }: LogoProps) => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lexus_logo.svg/1280px-Lexus_logo.svg.png"
      alt="Lexus Logo"
      width={1280}
      height={904}
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
