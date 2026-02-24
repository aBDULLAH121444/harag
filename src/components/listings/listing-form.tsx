'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CAR_MAKES, CAR_MODELS, CAR_YEARS, CAR_FEATURES } from '@/lib/constants';
import { generateCarDescription, createListingAction } from '@/lib/actions';
import { Wand2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const listingFormSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(1, 'Year is required'),
  price: z.string().min(1, 'Price is required'),
  mileage: z.string().min(1, 'Mileage is required'),
  location: z.string().min(1, 'Location is required'),
  condition: z.string().min(1, 'Condition is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  features: z.array(z.string()),
  sellerNotes: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

export default function ListingForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      location: '',
      condition: '',
      description: '',
      features: [],
      sellerNotes: '',
    },
  });

  const selectedMake = form.watch('make');

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const values = form.getValues();
    const result = await generateCarDescription({
      make: values.make,
      model: values.model,
      year: parseInt(values.year, 10),
      mileage: parseInt(values.mileage, 10),
      price: parseInt(values.price, 10),
      condition: values.condition,
      features: values.features,
      sellerNotes: values.sellerNotes,
    });
    setIsGenerating(false);

    if (result.description) {
      form.setValue('description', result.description, { shouldValidate: true });
      toast({ title: 'Success', description: 'Description generated successfully!' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  async function onSubmit(data: ListingFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        value.forEach(feature => formData.append('features', feature));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const result = await createListingAction(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast({ title: 'Listing Created', description: result.success });
      router.push('/dashboard');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Car Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('model', '');
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a make" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{CAR_MAKES.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedMake}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a model" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{selectedMake && CAR_MODELS[selectedMake]?.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a year" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{CAR_YEARS.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (SAR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 95000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 80000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{["Sana'a", "Aden", "Taiz", "Hodeidah", "Ibb", "Mukalla"].map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condition & Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select car condition" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>{['New', 'Like New', 'Good', 'Fair'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                    <FormLabel>Features</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CAR_FEATURES.map((feature) => (
                        <FormField
                            key={feature}
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                            <FormItem key={feature} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(feature)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), feature])
                                        : field.onChange(field.value?.filter((value) => value !== feature));
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">{feature}</FormLabel>
                            </FormItem>
                            )}
                        />
                        ))}
                    </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your car in detail..." className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormDescription>A detailed description helps sell your car faster. Minimum 50 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sellerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Recently serviced, new tires" {...field} />
                  </FormControl>
                   <FormDescription>Add any extra highlights for the AI assistant.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="outline" onClick={handleGenerateDescription} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generating...' : 'Smart Description Assistant'}
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
           {isSubmitting ? 'Submitting...' : 'Create Listing'}
        </Button>
      </form>
    </Form>
  );
}
