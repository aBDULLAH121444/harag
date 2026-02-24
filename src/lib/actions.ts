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
