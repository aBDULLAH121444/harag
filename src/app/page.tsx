import { getListings } from '@/lib/data';
import CarCard from '@/components/listings/car-card';
import FilterBar from '@/components/listings/filter-bar';

export default function Home() {
  const listings = getListings();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
          Find Your Next Car
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through the best cars in Yemen. Your dream car is just a click away.
        </p>
      </section>

      <FilterBar />

      <section className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <CarCard key={listing.id} car={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
