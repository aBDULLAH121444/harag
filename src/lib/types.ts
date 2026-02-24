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
  images: { id: string; url: string; hint: string }[];
  seller: {
    name: string;
    avatarId: string;
  };
  postedAt: Date;
  condition: 'جديد' | 'شبه جديد' | 'جيد' | 'مقبول';
};
