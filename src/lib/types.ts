import type { ImagePlaceholder } from './placeholder-images';

export type Car = {
  id: string;
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
    avatarId: string;
  };
  postedAt: Date;
  condition: 'جديد' | 'شبه جديد' | 'جيد' | 'مقبول';
};
