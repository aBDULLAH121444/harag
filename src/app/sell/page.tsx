'use client';

import ListingForm from "@/components/listings/listing-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function SellContent() {
  return (
    <section className="max-w-4xl mx-auto">
      <ListingForm />
    </section>
  );
}

export default function SellPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
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
