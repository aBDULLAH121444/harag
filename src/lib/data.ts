import type { Car } from './types';
import { PlaceHolderImages } from './placeholder-images';

const CAR_DESCRIPTIONS = [
  "هذه السيارة النقية هي مزيج مثالي من الأناقة والأداء. مع عدد قليل من الأميال وتاريخ خدمة كامل، إنها جاهزة لمغامرتها التالية. لا تفوت هذه الصفقة المذهلة.",
  "سيارة موثوقة وفعالة في استهلاك الوقود، مثالية للقيادة في المدينة والرحلات الطويلة على حد سواء. تمت صيانتها بدقة وتأتي مع مجموعة من الميزات الحديثة لراحتك وسلامتك.",
  "جرب الفخامة والقوة مع هذا الطراز الأعلى من نوعه. تصميمها المذهل يضاهيه تجربة قيادة مثيرة. تأتي محملة بالكامل بجميع الإضافات الاختيارية.",
  "السيارة العائلية المثالية، توفر مساحات داخلية واسعة وتقييمات أمان من الدرجة الأولى. لقد خدمت عائلتنا جيدًا وتبحث عن منزل جديد. في حالة ممتازة، من الداخل والخارج."
];

const locations = ["صنعاء", "عدن", "تعز", "الحديدة", "إب", "المكلا"];

const cars: Car[] = [
  {
    id: '1',
    make: 'تويوتا',
    model: 'لاند كروزر',
    year: 2022,
    price: 250000,
    mileage: 15000,
    location: locations[0],
    description: CAR_DESCRIPTIONS[0],
    features: ['فتحة سقف', 'مقاعد جلد', 'نظام ملاحة', 'دفع رباعي'],
    images: PlaceHolderImages.filter(img => img.id.startsWith('car-')),
    seller: { name: 'أحمد علي', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    condition: 'شبه جديد',
  },
  {
    id: '2',
    make: 'هيونداي',
    model: 'إلنترا',
    year: 2021,
    price: 85000,
    mileage: 45000,
    location: locations[1],
    description: CAR_DESCRIPTIONS[1],
    features: ['كاميرا خلفية', 'بلوتوث', 'مثبت سرعة'],
    images: PlaceHolderImages.filter(img => img.id.startsWith('car-')).reverse(),
    seller: { name: 'فاطمة صالح', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    condition: 'جيد',
  },
  {
    id: '3',
    make: 'فورد',
    model: 'إكسبلورر',
    year: 2020,
    price: 150000,
    mileage: 60000,
    location: locations[2],
    description: CAR_DESCRIPTIONS[3],
    features: ['جنوط ألمنيوم', 'بلوتوث', 'كاميرا خلفية'],
    images: [PlaceHolderImages[2], PlaceHolderImages[3], PlaceHolderImages[4]],
    seller: { name: 'أحمد علي', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    condition: 'جيد',
  },
  {
    id: '4',
    make: 'مرسيدس بنز',
    model: 'الفئة E',
    year: 2023,
    price: 320000,
    mileage: 5000,
    location: locations[0],
    description: CAR_DESCRIPTIONS[2],
    features: ['فتحة سقف', 'مقاعد جلد', 'نظام ملاحة', 'مثبت سرعة'],
    images: [PlaceHolderImages[4], PlaceHolderImages[5], PlaceHolderImages[6]],
    seller: { name: 'فاطمة صالح', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    condition: 'جديد',
  },
    {
    id: '5',
    make: 'تويوتا',
    model: 'كامري',
    year: 2019,
    price: 95000,
    mileage: 80000,
    location: locations[3],
    description: CAR_DESCRIPTIONS[1],
    features: ['كاميرا خلفية', 'بلوتوث', 'جنوط ألمنيوم'],
    images: [PlaceHolderImages[1], PlaceHolderImages[7], PlaceHolderImages[0]],
    seller: { name: 'أحمد علي', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    condition: 'جيد',
  },
  {
    id: '6',
    make: 'نيسان',
    model: 'باترول',
    year: 2021,
    price: 220000,
    mileage: 35000,
    location: locations[4],
    description: CAR_DESCRIPTIONS[0],
    features: ['دفع رباعي', 'نظام ملاحة', 'فتحة سقف'],
    images: [PlaceHolderImages[3], PlaceHolderImages[1], PlaceHolderImages[5]],
    seller: { name: 'فاطمة صالح', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    condition: 'شبه جديد',
  },
  {
    id: '7',
    make: 'بي إم دبليو',
    model: 'X5',
    year: 2020,
    price: 280000,
    mileage: 55000,
    location: locations[5],
    description: CAR_DESCRIPTIONS[2],
    features: ['مقاعد جلد', 'فتحة سقف', 'دفع رباعي', 'نظام ملاحة'],
    images: [PlaceHolderImages[5], PlaceHolderImages[6], PlaceHolderImages[7]],
    seller: { name: 'أحمد علي', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    condition: 'جيد',
  },
  {
    id: '8',
    make: 'كيا',
    model: 'سبورتاج',
    year: 2022,
    price: 110000,
    mileage: 25000,
    location: locations[1],
    description: CAR_DESCRIPTIONS[3],
    features: ['كاميرا خلفية', 'جنوط ألمنيوم', 'بلوتوث'],
    images: [PlaceHolderImages[7], PlaceHolderImages[0], PlaceHolderImages[2]],
    seller: { name: 'فاطمة صالح', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    condition: 'شبه جديد',
  },
];

export function getListings(filters?: {
    make?: string;
    model?: string;
    year?: string;
    maxPrice?: string;
  }) {
    if (!filters || Object.keys(filters).length === 0) {
      return cars;
    }
  
    return cars.filter(car => {
      if (filters.make && car.make !== filters.make) {
        return false;
      }
      if (filters.model && car.model !== filters.model) {
        return false;
      }
      if (filters.year && car.year.toString() !== filters.year) {
        return false;
      }
      if (filters.maxPrice && car.price > parseInt(filters.maxPrice, 10)) {
        return false;
      }
      return true;
    });
}

export function getListingById(id: string) {
  return cars.find(car => car.id === id);
}

export function getUserListings(userId: string) {
    // In a real app, userId would be used to filter.
    // Here we'll just return listings from a specific seller.
    return cars.filter(car => car.seller.name === 'أحمد علي');
}

export function getImageById(id: string) {
    return PlaceHolderImages.find(img => img.id === id);
}
