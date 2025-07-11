
import API from "@/app/lib/api/userServerAxios";
import { Restaurant } from "../../lib/types/restaurant";
import { HotelsPageClient } from "./HotelPageClient";



const fetchRestaurant = async (
  id: string
): Promise<{
  data: Restaurant[];
}> => {
  try {
    const response = await API.get(`/vendors?vendorId=${id}`);
    const data = await response.data;
    console.log(data)
    return { data };
  } catch (error) {
    console.error(error);
    // Handle error and return a default value or rethrow
    return { data: [] };
  }
};

const HotelsPage = async ({ id }: { id: string }) => {
  const data = await fetchRestaurant(id);


  const restaurant = data.data[0];

  // --- Add state for activeTab ---
  // Since this is a server component, you need to lift the tab state up to a client component.
  // We'll wrap the main content in a client component to manage the tab state.

  return (
    <HotelsPageClient id={id} restaurant={restaurant} />
  );
};

export default HotelsPage;

// --- Add this new client component below ---

