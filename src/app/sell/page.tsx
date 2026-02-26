'use client';

import ListingForm from "@/components/listings/listing-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function SellContent() {
  const searchParams = useSearchParams();
  const isEditing = !!searchParams.get('edit');

  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
          {isEditing ? 'تعديل إعلانك' : 'بع سيارتك'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {isEditing ? 'قم بتحديث تفاصيل سيارتك أدناه.' : 'املأ التفاصيل أدناه لعرض سيارتك في سوقنا.'}
        </p>
      </div>
      <ListingForm />
    </section>
  );
}

export default function SellPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }>
        <SellContent />
      </Suspense>
    </div>
  );
}
