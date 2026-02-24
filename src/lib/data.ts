import type { Car } from './types';
import { PlaceHolderImages } from './placeholder-images';

const CAR_DESCRIPTIONS = [
  "This pristine vehicle is a perfect blend of style and performance. With low mileage and a full service history, it's ready for its next adventure. Don't miss out on this incredible deal.",
  "A reliable and fuel-efficient car, ideal for city driving and long journeys alike. It has been meticulously maintained and comes with a host of modern features for your comfort and safety.",
  "Experience luxury and power with this top-of-the-line model. Its stunning design is matched by a thrilling driving experience. Comes fully loaded with all the optional extras.",
  "The perfect family car, offering spacious interiors and top-tier safety ratings. It has served our family well and is looking for a new home. In excellent condition, both inside and out."
];

const locations = ["Sana'a", "Aden", "Taiz", "Hodeidah", "Ibb", "Mukalla"];

const cars: Car[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2022,
    price: 250000,
    mileage: 15000,
    location: locations[0],
    description: CAR_DESCRIPTIONS[0],
    features: ['Sunroof', 'Leather Seats', 'Navigation System', '4x4'],
    images: PlaceHolderImages.filter(img => img.id.startsWith('car-')),
    seller: { name: 'Ahmed Ali', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    condition: 'Like New',
  },
  {
    id: '2',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2021,
    price: 85000,
    mileage: 45000,
    location: locations[1],
    description: CAR_DESCRIPTIONS[1],
    features: ['Backup Camera', 'Bluetooth', 'Cruise Control'],
    images: PlaceHolderImages.filter(img => img.id.startsWith('car-')).reverse(),
    seller: { name: 'Fatima Saleh', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    condition: 'Good',
  },
  {
    id: '3',
    make: 'Ford',
    model: 'Explorer',
    year: 2020,
    price: 150000,
    mileage: 60000,
    location: locations[2],
    description: CAR_DESCRIPTIONS[3],
    features: ['Alloy Wheels', 'Bluetooth', 'Backup Camera'],
    images: [PlaceHolderImages[2], PlaceHolderImages[3], PlaceHolderImages[4]],
    seller: { name: 'Ahmed Ali', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    condition: 'Good',
  },
  {
    id: '4',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    price: 320000,
    mileage: 5000,
    location: locations[0],
    description: CAR_DESCRIPTIONS[2],
    features: ['Sunroof', 'Leather Seats', 'Navigation System', 'Cruise Control'],
    images: [PlaceHolderImages[4], PlaceHolderImages[5], PlaceHolderImages[6]],
    seller: { name: 'Fatima Saleh', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    condition: 'New',
  },
    {
    id: '5',
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    price: 95000,
    mileage: 80000,
    location: locations[3],
    description: CAR_DESCRIPTIONS[1],
    features: ['Backup Camera', 'Bluetooth', 'Alloy Wheels'],
    images: [PlaceHolderImages[1], PlaceHolderImages[7], PlaceHolderImages[0]],
    seller: { name: 'Ahmed Ali', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    condition: 'Good',
  },
  {
    id: '6',
    make: 'Nissan',
    model: 'Patrol',
    year: 2021,
    price: 220000,
    mileage: 35000,
    location: locations[4],
    description: CAR_DESCRIPTIONS[0],
    features: ['4x4', 'Navigation System', 'Sunroof'],
    images: [PlaceHolderImages[3], PlaceHolderImages[1], PlaceHolderImages[5]],
    seller: { name: 'Fatima Saleh', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    condition: 'Like New',
  },
  {
    id: '7',
    make: 'BMW',
    model: 'X5',
    year: 2020,
    price: 280000,
    mileage: 55000,
    location: locations[5],
    description: CAR_DESCRIPTIONS[2],
    features: ['Leather Seats', 'Sunroof', '4x4', 'Navigation System'],
    images: [PlaceHolderImages[5], PlaceHolderImages[6], PlaceHolderImages[7]],
    seller: { name: 'Ahmed Ali', avatarId: 'avatar-1' },
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    condition: 'Good',
  },
  {
    id: '8',
    make: 'Kia',
    model: 'Sportage',
    year: 2022,
    price: 110000,
    mileage: 25000,
    location: locations[1],
    description: CAR_DESCRIPTIONS[3],
    features: ['Backup Camera', 'Alloy Wheels', 'Bluetooth'],
    images: [PlaceHolderImages[7], PlaceHolderImages[0], PlaceHolderImages[2]],
    seller: { name: 'Fatima Saleh', avatarId: 'avatar-2' },
    postedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    condition: 'Like New',
  },
];

export function getListings() {
  return cars;
}

export function getListingById(id: string) {
  return cars.find(car => car.id === id);
}

export function getUserListings(userId: string) {
    // In a real app, userId would be used to filter.
    // Here we'll just return listings from a specific seller.
    return cars.filter(car => car.seller.name === 'Ahmed Ali');
}

export function getImageById(id: string) {
    return PlaceHolderImages.find(img => img.id === id);
}
