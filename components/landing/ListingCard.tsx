import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Listing {
  id: string
  name: string
  type: "hotel" | "restaurant" | string
  rating: number
  price?: number
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{listing.name}</h2>
        <p className="text-muted-foreground mb-2">Type: {listing.type}</p>
        <p className="mb-2">Rating: {listing.rating}/5</p>
        {listing.price && <p className="font-bold">Price: ₦{listing.price}/night</p>}
      </div>
      <div>
        <Button asChild className="w-full">
          <Link href={`/${listing.type}s/${listing.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  )
}

