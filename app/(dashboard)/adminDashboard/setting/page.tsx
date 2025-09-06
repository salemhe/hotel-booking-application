"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

export default function Page() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Restaurant");
  const [supportEmail, setSupportEmail] = useState("support@bookings.com");
  const [supportPhone, setSupportPhone] = useState("+234 000 111 234");

  const handleSave = () => {
    const payload = { businessName, businessType, supportEmail, supportPhone };
    try {
      localStorage.setItem("admin_settings", JSON.stringify(payload));
    } catch (_) {}
  };

  return (
    <div className="px-3 sm:px-6 lg:px-10 py-4">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="branch">Branch Settings</TabsTrigger>
          <TabsTrigger value="reservation">Reservation</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Business name</Label>
                <Input id="name" value={businessName} onChange={(e)=>setBusinessName(e.target.value)} placeholder="Joe's Platter" />
              </div>
              <div>
                <Label>Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                    <SelectItem value="Hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Support Contact Email</Label>
                <Input id="email" type="email" value={supportEmail} onChange={(e)=>setSupportEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Support Phone Number</Label>
                <Input id="phone" value={supportPhone} onChange={(e)=>setSupportPhone(e.target.value)} />
              </div>
              <div className="pt-2">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm text-gray-600">Upload a logo on your profile and customer facing pages</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 400x400px. Max file size: 2MB.</p>
                </div>
                <Button variant="outline">Browse Files</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branch">
          <Card>
            <CardContent className="p-6 text-sm text-gray-600">Branch settings coming soon.</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservation">
          <Card>
            <CardContent className="p-6 text-sm text-gray-600">Reservation preferences coming soon.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
