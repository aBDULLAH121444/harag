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
  make: z.string().describe('The make of the car (e.g., Toyota).'),
  model: z.string().describe('The model of the car (e.g., Camry).'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).describe('The manufacturing year of the car.'),
  mileage: z.number().int().min(0).describe('The total mileage of the car.'),
  price: z.number().min(0).describe('The asking price for the car.'),
  condition: z.string().describe('The overall condition of the car (e.g., Excellent, Good, Fair).'),
  features: z.array(z.string()).describe('A list of key features of the car (e.g., Sunroof, Leather seats, Navigation).'),
  sellerNotes: z.string().optional().describe('Any additional notes or highlights from the seller.'),
});
export type SmartDescriptionAssistantInput = z.infer<typeof SmartDescriptionAssistantInputSchema>;

const SmartDescriptionAssistantOutputSchema = z.object({
  description: z.string().describe('A compelling and detailed car advertisement description.'),
});
export type SmartDescriptionAssistantOutput = z.infer<typeof SmartDescriptionAssistantOutputSchema>;

export async function smartDescriptionAssistant(input: SmartDescriptionAssistantInput): Promise<SmartDescriptionAssistantOutput> {
  return smartDescriptionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartDescriptionAssistantPrompt',
  input: { schema: SmartDescriptionAssistantInputSchema },
  output: { schema: SmartDescriptionAssistantOutputSchema },
  prompt: `You are an expert copywriter specializing in creating compelling and detailed car advertisement descriptions for a marketplace. Your goal is to write a description that attracts buyers by highlighting the car's best features and overall value. Use enthusiastic and persuasive language.

Here are the car specifications:

Make: {{{make}}}
Model: {{{model}}}
Year: {{{year}}}
Mileage: {{{mileage}}} km
Price: {{{price}}} SAR
Condition: {{{condition}}}
Features:
{{#each features}}- {{{this}}}
{{/each}}{{#if sellerNotes}}
Seller's Highlights: {{{sellerNotes}}}{{/if}}

Based on the information above, generate a detailed and engaging car advertisement description that is approximately 200-300 words long. Focus on benefits and paint an attractive picture for potential buyers.`,
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
