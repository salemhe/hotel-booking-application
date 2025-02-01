import Header from "@/components/landing/Header";
import { ListingCard } from "@/components/landing/ListingCard";

// This would typically come from an API call
const mockResults = [
  { id: "1", name: "Luxury Hotel", type: "hotel", rating: 4.5, price: 200 },
  { id: "2", name: "Cozy B&B", type: "hotel", rating: 4.2, price: 120 },
  { id: "3", name: "Gourmet Restaurant", type: "restaurant", rating: 4.8 },
  { id: "4", name: "Family Inn", type: "hotel", rating: 4.0, price: 150 },
  { id: "5", name: "Seafood Bistro", type: "restaurant", rating: 4.3 },
];

export default async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const location = (await searchParams).location
  const type = (await searchParams).type

  // In a real application, you would use these params to fetch results from your API
  console.log("Searching for:", { location, type });

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-16 mt-7">
        <h1 className="text-3xl font-bold mb-8">Search Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockResults.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </>
  );
}
