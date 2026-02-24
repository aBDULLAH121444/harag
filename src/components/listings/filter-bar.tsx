'use client';

import { CAR_MAKES, CAR_MODELS, CAR_YEARS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import React from 'react';

export default function FilterBar() {
  const [selectedMake, setSelectedMake] = React.useState<string>('');

  return (
    <Card className="mb-8 shadow-sm">
        <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-1">
                    <label className="text-sm font-medium text-muted-foreground">الشركة المصنعة</label>
                    <Select onValueChange={setSelectedMake}>
                        <SelectTrigger>
                        <SelectValue placeholder="اختر الشركة" />
                        </SelectTrigger>
                        <SelectContent>
                        {CAR_MAKES.map((make) => (
                            <SelectItem key={make} value={make}>
                            {make}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-1">
                     <label className="text-sm font-medium text-muted-foreground">الموديل</label>
                    <Select disabled={!selectedMake}>
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
                    <Select>
                        <SelectTrigger>
                        <SelectValue placeholder="اختر السنة" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <Select>
                        <SelectTrigger>
                        <SelectValue placeholder="أي سعر" />
                        </SelectTrigger>
                        <SelectContent>
                        {[50000, 75000, 100000, 150000, 200000, 300000].map((price) => (
                            <SelectItem key={price} value={String(price)}>
                            {price.toLocaleString()} ريال سعودي
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full">
                    <Search className="ml-2 h-4 w-4" />
                    بحث
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}
