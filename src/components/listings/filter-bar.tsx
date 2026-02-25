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
import { CarBrandLogo } from './car-brand-logos';
import { cn } from '@/lib/utils';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedMake, setSelectedMake] = React.useState(searchParams.get('make') || '');
  const [selectedModel, setSelectedModel] = React.useState(searchParams.get('model') || '');
  const [selectedYear, setSelectedYear] = React.useState(searchParams.get('year') || '');

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (selectedMake && !CAR_MODELS[selectedMake]?.includes(selectedModel)) {
      setSelectedModel('');
    }
  }, [selectedMake, selectedModel]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedMake) {
      params.set('make', selectedMake);
    }
    if (selectedModel) {
      params.set('model', selectedModel);
    }
    if (selectedYear) {
      params.set('year', selectedYear);
    }
    
    router.push(`/?${params.toString()}`);
  };

  const handleMakeSelection = (make: string) => {
    if (selectedMake === make) {
      setSelectedMake('');
    } else {
      setSelectedMake(make);
    }
  };

  if (!isMounted) {
    return (
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-4 space-y-4">
            <div className="flex gap-3 overflow-hidden pb-4">
                <Skeleton className="h-12 w-20 flex-shrink-0" />
                <Skeleton className="h-12 w-20 flex-shrink-0" />
                <Skeleton className="h-12 w-20 flex-shrink-0" />
                <Skeleton className="h-12 w-20 flex-shrink-0" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 shadow-sm">
        <CardContent className="p-4 space-y-4">
            <div>
                <ScrollArea className="w-full whitespace-nowrap" dir="rtl">
                    <div className="flex w-max space-x-reverse space-x-2 pb-4 px-1">
                        <Button 
                            variant={!selectedMake ? 'default' : 'outline'}
                            onClick={() => handleMakeSelection('')}
                            className="h-12 px-4 flex-shrink-0 rounded-lg font-bold"
                        >
                            الكل
                        </Button>
                        {CAR_MAKES.map((make) => (
                             <button
                                key={make}
                                onClick={() => handleMakeSelection(make)}
                                className={cn(
                                    "p-1 h-12 w-20 flex items-center justify-center rounded-lg border-2 transition-all duration-300 flex-shrink-0 group relative overflow-hidden",
                                    selectedMake === make
                                        ? "border-primary bg-white shadow-md scale-105"
                                        : "border-transparent bg-white/50 hover:border-primary/30 hover:bg-white hover:scale-105"
                                )}
                                title={make}
                            >
                                <CarBrandLogo 
                                  brand={make} 
                                  className={cn(
                                    "h-8 w-auto transition-transform duration-300 group-hover:scale-110 mix-blend-multiply"
                                  )}
                                />
                                {selectedMake === make && (
                                  <div className="absolute bottom-1 right-1">
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                  </div>
                                )}
                            </button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                     <label className="text-sm font-medium text-muted-foreground mr-1">الموديل</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedMake}>
                        <SelectTrigger className="rounded-lg">
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
                <div>
                     <label className="text-sm font-medium text-muted-foreground mr-1">السنة</label>
                    <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val === 'all' ? '' : val)}>
                        <SelectTrigger className="rounded-lg">
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
                <Button className="w-full rounded-lg font-bold" onClick={handleSearch}>
                    <Search className="ml-2 h-4 w-4" />
                    بحث
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
