'use client';
import React from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

type LogoProps = {
  className?: string;
};

// Uses currentColor for stroke
const ToyotaLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 68" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="6">
    <title>Toyota</title>
    <ellipse cx="50" cy="34" rx="46" ry="32" />
    <ellipse cx="50" cy="34" rx="20" ry="32" />
    <ellipse cx="50" cy="22" rx="46" ry="16" />
  </svg>
);

// Uses currentColor for stroke
const HyundaiLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="5">
    <title>Hyundai</title>
    <ellipse cx="32" cy="32" rx="29" ry="22"/>
    <path d="M22 19 L 28 45" transform="skewX(-15) translate(4)"/>
    <path d="M44 19 L 36 45" transform="skewX(-15) translate(4)"/>
    <line x1="24" y1="32" x2="40" y2="32" transform="skewX(-15) translate(4)"/>
  </svg>
);

// Use a real image for Ford logo
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

// Uses currentColor
const MercedesLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="5" fill="none">
    <title>Mercedes-Benz</title>
    <circle cx="32" cy="32" r="29"/>
    <path d="M32 3 L32 32"/>
    <path d="M32 32 L 59.5 47.5"/>
    <path d="M32 32 L 4.5 47.5"/>
  </svg>
);

// Specific colors
const BMWLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
    <title>BMW</title>
    <circle cx="32" cy="32" r="30" stroke="#444" strokeWidth="4" fill="white" />
    <path d="M32 2 v30 h30 a30,30 0 0,0 -30,-30 z" fill="#008acf" stroke="none"/>
    <path d="M32 2 v30 h-30 a30,30 0 0,1 30,-30 z" fill="white" stroke="none"/>
    <path d="M32 62 v-30 h30 a30,30 0 0,1 -30,30 z" fill="white" stroke="none"/>
    <path d="M32 62 v-30 h-30 a30,30 0 0,0 30,30 z" fill="#008acf" stroke="none"/>
    <circle cx="32" cy="32" r="30" stroke="#444" strokeWidth="4" fill="none"/>
  </svg>
);

// Uses currentColor
const NissanLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg" className={className}>
    <title>Nissan</title>
    <circle cx="50" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
    <rect x="20" y="17" width="60" height="6" fill="currentColor" />
  </svg>
);

// Uses currentColor
const KiaLogo = ({ className }: LogoProps) => (
  <svg viewBox="5 5 110 40" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor" strokeWidth="6" fill="none">
    <title>KIA</title>
    <path d="M10 40 L 30 10 L 50 40" />
    <path d="M30 25 L 45 10" />
    <path d="M60 10 L 60 40" />
    <path d="M75 10 L 90 40 L 105 10" />
  </svg>
);

// Uses currentColor
const LexusLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="6">
    <title>Lexus</title>
    <ellipse cx="50" cy="35" rx="47" ry="32"/>
    <path d="M 35 15 L 35 55 L 65 55" />
  </svg>
);

// Uses currentColor
const ChevroletLogo = ({ className }: LogoProps) => (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
    <title>Chevrolet</title>
    <path d="M0 15 L45 15 L55 5 L65 5 L75 15 L120 15 L120 25 L75 25 L65 35 L55 35 L45 25 L0 25 Z" />
  </svg>
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

  return <LogoComponent className={cn("h-full w-full object-contain", className)} />;
};
