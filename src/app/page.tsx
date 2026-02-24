import { getListings } from '@/lib/data';
import CarCard from '@/components/listings/car-card';
import FilterBar from '@/components/listings/filter-bar';

export default function Home({
  searchParams,
}: {
  searchParams?: {
    make?: string;
    model?: string;
    year?: string;
    maxPrice?: string;
  };
}) {
  const listings = getListings(searchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          تصفح أفضل السيارات في اليمن. سيارة أحلامك على بعد نقرة واحدة.
        </p>
      </section>

      <FilterBar />

      <section className="mt-8">
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <CarCard key={listing.id} car={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">لم يتم العثور على سيارات</h2>
            <p className="text-muted-foreground mt-2">حاول تعديل معايير البحث الخاصة بك.</p>
          </div>
        )}
      </section>
    </div>
  );
}
