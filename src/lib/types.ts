import type { ImagePlaceholder } from './placeholder-images';

export type Car = {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  description: string;
  features: string[];
  images: ImagePlaceholder[];
  seller: {
    name: string;
    avatarUrl?: string;
    phoneNumber?: string;
  };
  postedAt: Date;
  condition: 'جديد' | 'شبه جديد' | 'جيد' | 'مقبول';
};
