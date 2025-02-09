import AddMenuButton from "@/components/AddMenuButton";
import MenuItem from "@/components/MenuItem";

export default function VendorMenuPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Vendor Menu Management</h1>
      <div className="mb-8 flex items-start">
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
