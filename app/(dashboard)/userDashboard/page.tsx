"use client";
// import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, User, 
  // Mail, Phone
 } from "lucide-react";

export default function UserDashboard() {
  // const { user, loading } = useSession();

  // if (loading) {
  //   return (
  //     <div className="flex flex-col gap-4 p-4">
  //       <div className="grid auto-rows-min gap-4 md:grid-cols-3">
  //         <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
  //         <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
  //         <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
  //       </div>
  //       <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-gray-100" />
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Information</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Name: {user?.firstName} {user?.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email: {user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Phone: {user?.phone || "Not provided"}</span>
              </div>
            </div> */}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Your session is currently active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}