import { Building, Calendar, MapPin, Search, Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { RestaurantSearch } from "./RestaurantSearch";

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
                <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <Label htmlFor="hotel-location">Location</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <MapPin
                        className="absolute top-1/2 left-3 -mt-2 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="hotel-location"
                        placeholder="Enter a location"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hotel-check-in">Check-in Date</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Calendar
                        className="absolute top-1/2 left-3 -mt-2 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="hotel-check-in"
                        type="date"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hotel-check-out">Check-out Date</Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Calendar
                        className="absolute top-1/2 left-3 -mt-2 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="hotel-check-out"
                        type="date"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hotel-guests">Number of Guests</Label>
                    <Select>
                      <SelectTrigger id="hotel-guests">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 guest</SelectItem>
                        <SelectItem value="2">2 guests</SelectItem>
                        <SelectItem value="3">3 guests</SelectItem>
                        <SelectItem value="4">4 guests</SelectItem>
                        <SelectItem value="5">5+ guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Search Hotels
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
