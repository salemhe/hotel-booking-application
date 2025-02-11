import AddMenuButton from "@/components/AddMenuButton";
import MenuItem from "@/components/MenuItem";

export default function VendorMenuPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Menu</h2>
        <AddMenuButton />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <MenuItem key={i} />
        ))}
      </div>
    </div>
  );
}
