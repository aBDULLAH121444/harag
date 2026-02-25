'use client';
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

const ToyotaLogo = ({ className }: LogoProps) => (
  <Image
    src="https://res.cloudinary.com/dbm1benv0/image/upload/v1721833580/toyota-logo-black_xio6nx.png"
    alt="Toyota Logo"
    width={100}
    height={100}
    className={className}
    priority
  />
);

const HyundaiLogo = ({ className }: LogoProps) => (
    <Image
        src="https://res.cloudinary.com/dbm1benv0/image/upload/v1721833579/hyundai-logo-black_vdpvlm.png"
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
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1721833579/mercedes-logo-black_u6f84g.png"
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
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1721833579/nissan-logo-black_qwsefy.png"
      alt="Nissan Logo"
      width={1280}
      height={293}
      className={className}
      priority
    />
);

const KiaLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1721833579/kia-logo-black_d4qfld.png"
      alt="Kia Logo"
      width={320}
      height={63}
      className={className}
      priority
    />
);

const LexusLogo = ({ className }: LogoProps) => (
    <Image
      src="https://res.cloudinary.com/dbm1benv0/image/upload/v1721833579/lexus-logo-black_zbtgoy.png"
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
