'use server';

import { smartDescriptionAssistant, type SmartDescriptionAssistantInput } from '@/ai/flows/smart-description-assistant';
import { z } from 'zod';

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

const listingSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.string(),
  price: z.string(),
  mileage: z.string(),
  location: z.string(),
  condition: z.string(),
  description: z.string(),
  features: z.array(z.string()),
});

export async function createListingAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = listingSchema.safeParse({
      ...data,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      features: formData.getAll('features'),
    });
    
    if (!parsed.success) {
        return { error: 'البيانات المقدمة غير صالحة.' };
    }

    // In a real app, you would save this data to a database.
    console.log('New listing created:', parsed.data);

    return { success: 'تم إنشاء قائمتك بنجاح!' };
}
