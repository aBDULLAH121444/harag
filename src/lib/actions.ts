'use server';

import { smartDescriptionAssistant, type SmartDescriptionAssistantInput } from '@/ai/flows/smart-description-assistant';
import { z } from 'zod';
import { getFirebaseServerServices } from '@/firebase/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PlaceHolderImages } from './placeholder-images';

const generateDescriptionSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number(),
  mileage: z.number(),
  price: z.number(),
  condition: z.string(),
  features: z.array(z.string()),
  sellerNotes: z.string().optional(),
});

export async function generateCarDescription(input: SmartDescriptionAssistantInput) {
  const parsedInput = generateDescriptionSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'مدخلات غير صالحة.' };
  }

  try {
    const result = await smartDescriptionAssistant(parsedInput.data);
    return { description: result.description };
  } catch (error) {
    console.error(error);
    return { error: 'فشل في إنشاء الوصف. الرجاء معاودة المحاولة.' };
  }
}

const listingFormSchema = z.object({
  make: z.string().min(1, 'الشركة المصنعة مطلوبة'),
  model: z.string().min(1, 'الموديل مطلوب'),
  year: z.string().min(1, 'السنة مطلوبة'),
  price: z.string().min(1, 'السعر مطلوب').regex(/^\d+$/, "يجب أن يكون السعر رقمًا"),
  mileage: z.string().min(1, 'المسافة المقطوعة مطلوبة').regex(/^\d+$/, "يجب أن تكون المسافة المقطوعة رقمًا"),
  location: z.string().min(1, 'الموقع مطلوب'),
  condition: z.string().min(1, 'الحالة مطلوبة'),
  description: z.string().min(50, 'يجب أن لا يقل الوصف عن 50 حرفًا'),
  features: z.array(z.string()),
  sellerNotes: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

export async function createListingAction(data: ListingFormValues, userId: string) {
    const parsed = listingFormSchema.safeParse(data);
    
    if (!parsed.success) {
        const errorMessages = parsed.error.issues.map(issue => issue.message).join(', ');
        return { error: `البيانات المقدمة غير صالحة: ${errorMessages}` };
    }

    if (!userId) {
        return { error: 'المستخدم غير مصادق عليه.' };
    }

    try {
        const { firestore } = getFirebaseServerServices();
        const carListingsRef = collection(firestore, 'carListings');

        const carImages = PlaceHolderImages.filter(img => !img.id.startsWith('avatar-'))
                                             .sort(() => 0.5 - Math.random())
                                             .slice(0, 3)
                                             .map(img => img.imageUrl);

        const newListingData = {
            userId: userId,
            title: `${parsed.data.year} ${parsed.data.make} ${parsed.data.model}`,
            make: parsed.data.make,
            model: parsed.data.model,
            year: parseInt(parsed.data.year, 10),
            price: parseInt(parsed.data.price, 10),
            currency: 'ريال سعودي',
            description: parsed.data.description,
            images: carImages,
            mileage: parseInt(parsed.data.mileage, 10),
            location: parsed.data.location,
            condition: parsed.data.condition,
            features: parsed.data.features,
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            viewCount: 0,
        };

        await addDoc(carListingsRef, newListingData);

        return { success: 'تم إنشاء قائمتك بنجاح!' };

    } catch (e) {
        console.error("Error creating listing:", e);
        return { error: 'حدث خطأ أثناء إنشاء الإعلان. الرجاء معاودة المحاولة.' };
    }
}
