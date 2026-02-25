import type { ImagePlaceholder } from './placeholder-images';

export type Car = {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  location: string;
  description: string;
  features: string[];
  images: ImagePlaceholder[];
  seller: {
    name: string;
    avatarUrl?: string;
    phoneNumber?: string;
    joinedAt: Date;
  };
  postedAt: Date;
  condition: 'جديد' | 'شبه جديد' | 'جيد' | 'مقبول';
  status: string;
};

    