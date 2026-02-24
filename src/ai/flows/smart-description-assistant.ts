'use server';
/**
 * @fileOverview An AI assistant that generates compelling car advertisement descriptions based on provided car specifications.
 *
 * - smartDescriptionAssistant - A function that handles the description generation process.
 * - SmartDescriptionAssistantInput - The input type for the smartDescriptionAssistant function.
 * - SmartDescriptionAssistantOutput - The return type for the smartDescriptionAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartDescriptionAssistantInputSchema = z.object({
  make: z.string().describe('الشركة المصنعة للسيارة (مثال: تويوتا).'),
  model: z.string().describe('موديل السيارة (مثال: كامري).'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).describe('سنة تصنيع السيارة.'),
  mileage: z.number().int().min(0).describe('المسافة الإجمالية التي قطعتها السيارة.'),
  price: z.number().min(0).describe('السعر المطلوب للسيارة.'),
  condition: z.string().describe('الحالة العامة للسيارة (مثال: ممتاز، جيد، مقبول).'),
  features: z.array(z.string()).describe('قائمة بالميزات الرئيسية للسيارة (مثال: فتحة سقف، مقاعد جلد، نظام ملاحة).'),
  sellerNotes: z.string().optional().describe('أي ملاحظات أو مميزات إضافية من البائع.'),
});
export type SmartDescriptionAssistantInput = z.infer<typeof SmartDescriptionAssistantInputSchema>;

const SmartDescriptionAssistantOutputSchema = z.object({
  description: z.string().describe('وصف إعلان سيارة جذاب ومفصل.'),
});
export type SmartDescriptionAssistantOutput = z.infer<typeof SmartDescriptionAssistantOutputSchema>;

export async function smartDescriptionAssistant(input: SmartDescriptionAssistantInput): Promise<SmartDescriptionAssistantOutput> {
  return smartDescriptionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartDescriptionAssistantPrompt',
  input: { schema: SmartDescriptionAssistantInputSchema },
  output: { schema: SmartDescriptionAssistantOutputSchema },
  prompt: `أنت كاتب إعلانات خبير متخصص في إنشاء أوصاف إعلانات سيارات جذابة ومفصلة لسوق إلكتروني. هدفك هو كتابة وصف يجذب المشترين من خلال إبراز أفضل ميزات السيارة وقيمتها الإجمالية. استخدم لغة حماسية ومقنعة.

إليك مواصفات السيارة:

الشركة المصنعة: {{{make}}}
الموديل: {{{model}}}
السنة: {{{year}}}
المسافة المقطوعة: {{{mileage}}} كم
السعر: {{{price}}} ريال سعودي
الحالة: {{{condition}}}
الميزات:
{{#each features}}- {{{this}}}
{{/each}}{{#if sellerNotes}}
ملاحظات البائع: {{{sellerNotes}}}{{/if}}

بناءً على المعلومات الواردة أعلاه، قم بإنشاء وصف إعلان سيارة مفصل وجذاب يتراوح طوله بين 150-250 كلمة. ركز على الفوائد وارسم صورة جذابة للمشترين المحتملين.`,
});

const smartDescriptionAssistantFlow = ai.defineFlow(
  {
    name: 'smartDescriptionAssistantFlow',
    inputSchema: SmartDescriptionAssistantInputSchema,
    outputSchema: SmartDescriptionAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
