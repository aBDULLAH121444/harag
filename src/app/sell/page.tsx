import ListingForm from "@/components/listings/listing-form";

export default function SellPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
                بع سيارتك
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                املأ التفاصيل أدناه لعرض سيارتك في سوقنا.
            </p>
        </div>
        <ListingForm />
      </section>
    </div>
  );
}
