import { Building, Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { RestaurantSearch } from "./RestaurantSearch";
import { HotelSearch } from "./HoteslSearch";

export function TabbedSearch() {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative -mt-16 bg-white rounded-lg shadow-lg">
        <Tabs defaultValue="restaurants" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="restaurants">
              <Utensils className="mr-2 h-4 w-4" />
              Restaurants
            </TabsTrigger>
            <TabsTrigger value="hotels">
              <Building className="mr-2 h-4 w-4" />
              Hotels
            </TabsTrigger>
          </TabsList>
          <TabsContent value="restaurants">
            <Card>
              <CardContent className="p-6">
                <RestaurantSearch />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="hotels">
            <Card>
              <CardContent className="p-6">
                <HotelSearch />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
