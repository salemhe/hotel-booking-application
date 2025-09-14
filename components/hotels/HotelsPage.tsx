
import API from "@/lib/api/userServerAxios";
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

  return (
    <HotelsPageClient id={id} restaurant={restaurant} />
  );
};

export default HotelsPage;


