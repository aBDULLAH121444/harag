import { collection, getDocs, getDoc, doc, query, where, orderBy, Timestamp, Firestore } from 'firebase/firestore';
import { getFirebaseServerServices } from '@/firebase/server';
import type { Car } from './types';
import { PlaceHolderImages } from './placeholder-images';

// Helper function to convert a Firestore document to a Car object
function docToCar(docSnap: any): Car {
    const data = docSnap.data();
    const images = (data.images || []).map((url: string, index: number) => {
        // Attempt to find a matching placeholder image to retain hints
        const found = PlaceHolderImages.find(p => p.imageUrl === url);
        if (found) return found;
        
        // If not found, create a fallback placeholder
        return {
            id: `fb-img-${docSnap.id}-${index}`,
            imageUrl: url,
            description: `${data.make} ${data.model}`,
            imageHint: `${data.make.toLowerCase()} ${data.model.toLowerCase()}`
        };
    });

    return {
        id: docSnap.id,
        userId: data.userId,
        make: data.make,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        location: data.location,
        description: data.description,
        features: data.features || [],
        images: images,
        seller: {
            name: data.sellerName || 'مستخدم غير معروف',
            // The UI expects an avatarId for the placeholder lookup.
            // This is a simplification. In a real app, this would be a URL from the user profile.
            avatarId: 'avatar-1' 
        },
        postedAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        condition: data.condition,
    };
}

export async function getListings(filters?: {
    make?: string;
    model?: string;
    year?: string;
    maxPrice?: string;
  }): Promise<Car[]> {
    const { firestore: db } = getFirebaseServerServices();
    const carListingsRef = collection(db, 'carListings');
    
    let q = query(carListingsRef, where('status', '==', 'active'));

    // Apply filters if they exist
    if (filters) {
        if (filters.make) {
            q = query(q, where('make', '==', filters.make));
        }
        if (filters.model) {
            q = query(q, where('model', '==', filters.model));
        }
        if (filters.year && !isNaN(parseInt(filters.year))) {
            q = query(q, where('year', '==', parseInt(filters.year, 10)));
        }
        if (filters.maxPrice && !isNaN(parseInt(filters.maxPrice))) {
            q = query(q, where('price', '<=', parseInt(filters.maxPrice, 10)));
        }
    }

    try {
        const snapshot = await getDocs(q);
        const listings = snapshot.docs.map(docToCar);
        // Sort listings by date descending (newest first)
        listings.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
        return listings;
    } catch (e) {
        console.error("Error getting listings: ", e);
        // This can happen if Firestore indexes are not set up.
        // Return an empty array to prevent the page from crashing.
        return [];
    }
}

export async function getListingById(id: string): Promise<Car | undefined> {
  const { firestore: db } = getFirebaseServerServices();
  if (!id) return undefined;
  
  const docRef = doc(db, 'carListings', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const car = docToCar(docSnap);
    
    // Attempt to fetch seller's profile for more details
    try {
        const userProfileSnap = await getDoc(doc(db, 'users', car.userId));
        if (userProfileSnap.exists()) {
            const userData = userProfileSnap.data();
            car.seller.name = `${userData.firstName} ${userData.lastName}`.trim() || userData.username;
            // Here you could map a real avatar URL if the UserProfile and Car types were updated.
            // Sticking to avatarId for now to avoid breaking UI components.
        }
    } catch (e) {
        console.error(`Failed to fetch user profile for ${car.userId}:`, e);
    }
    
    return car;
  } else {
    return undefined; // Not found
  }
}

export async function getUserListings(userId: string): Promise<Car[]> {
    const { firestore: db } = getFirebaseServerServices();
    if (!userId) return [];
    
    const carListingsRef = collection(db, 'carListings');
    const q = query(carListingsRef, where('userId', '==', userId));

    try {
        const snapshot = await getDocs(q);
        const listings = snapshot.docs.map(docToCar);
        // Sort listings by date descending (newest first)
        listings.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
        return listings;
    } catch (e) {
        console.error(`Error getting listings for user ${userId}:`, e);
        return [];
    }
}

export function getImageById(id: string) {
    return PlaceHolderImages.find(img => img.id === id);
}
