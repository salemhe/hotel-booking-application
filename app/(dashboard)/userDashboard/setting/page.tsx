"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user_profile_settings");
      if (saved) {
        const p = JSON.parse(saved);
        setFirstName(p.firstName || "");
        setLastName(p.lastName || "");
        setEmail(p.email || "");
        setPhone(p.phone || "");
      }
    } catch (_) {}
  }, []);

  const handleSave = () => {
    const payload = { firstName, lastName, email, phone };
    try { localStorage.setItem("user_profile_settings", JSON.stringify(payload)); } catch (_) {}
  };

  return (
    <div className="px-3 sm:px-6 lg:px-10 py-4">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first">First name</Label>
              <Input id="first" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="last">Last name</Label>
              <Input id="last" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
