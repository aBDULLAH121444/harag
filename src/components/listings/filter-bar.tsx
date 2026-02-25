'use client';

import { CAR_MAKES, CAR_MODELS, CAR_YEARS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedMake, setSelectedMake] = React.useState(searchParams.get('make') || '');
  const [selectedModel, setSelectedModel] = React.useState(searchParams.get('model') || '');
  const [selectedYear, setSelectedYear] = React.useState(searchParams.get('year') || '');
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get('maxPrice') || '');

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    // When the selected make is changed, if the current model is not valid for the new make, reset it.
    if (selectedMake && !CAR_MODELS[selectedMake]?.includes(selectedModel)) {
      setSelectedModel('');
    }
  }, [selectedMake, selectedModel]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedMake) {
      params.set('make', selectedMake);
      if (selectedModel) {
        params.set('model', selectedModel);
      }
    }
    if (selectedYear) params.set('year', selectedYear);
    if (maxPrice) params.set('maxPrice', maxPrice);
    
    router.push(`/?${params.toString()}`);
  };

  if (!isMounted) {
    return (
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-4 space-y-4">
            <div className="flex gap-2 overflow-hidden">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-28" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                    <Skeleton className="h-5 w-16 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="h-5 w-12 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 shadow-sm">
        <CardContent className="p-4 space-y-4">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max gap-2 pb-4">
                    {CAR_MAKES.map((make) => (
                        <Button
                            key={make}
                            variant={selectedMake === make ? 'default' : 'outline'}
                            onClick={() => setSelectedMake(make)}
                            className="whitespace-nowrap"
                        >
                            {make}
                        </Button>
                    ))}
                    <Button 
                        variant={!selectedMake ? 'default' : 'outline'}
                        onClick={() => setSelectedMake('')}
                    >
                        الكل
                    </Button>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1">
                     <label className="text-sm font-medium text-muted-foreground">الموديل</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedMake}>
                        <SelectTrigger>
                        <SelectValue placeholder="اختر الموديل" />
                        </SelectTrigger>
                        <SelectContent>
                        {selectedMake && CAR_MODELS[selectedMake]?.map((model) => (
                            <SelectItem key={model} value={model}>
                            {model}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1">
                     <label className="text-sm font-medium text-muted-foreground">السنة</label>
                    <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val === 'all' ? '' : val)}>
                        <SelectTrigger>
                        <SelectValue placeholder="اختر السنة" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">كل السنوات</SelectItem>
                        {CAR_YEARS.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                            {year}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1">
                     <label className="text-sm font-medium text-muted-foreground">أعلى سعر</label>
                    <Select value={maxPrice} onValueChange={(val) => setMaxPrice(val === 'all' ? '' : val)}>
                        <SelectTrigger>
                        <SelectValue placeholder="أي سعر" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">أي سعر</SelectItem>
                        {[50000, 75000, 100000, 150000, 200000, 300000].map((price) => (
                            <SelectItem key={price} value={String(price)}>
                            {price.toLocaleString()} ريال سعودي
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full" onClick={handleSearch}>
                    <Search className="ml-2 h-4 w-4" />
                    بحث
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
