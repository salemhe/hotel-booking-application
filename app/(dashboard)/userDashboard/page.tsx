"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api, setAuthToken } from "@/lib/axios-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token = localStorage.getItem("authToken");
        let userId = localStorage.getItem("userId");

        if (!token || !userId) {
          const sessionResponse = await api.get("/sessions/user");
          token = sessionResponse.data.token;
          userId = sessionResponse.data.userId;
          const expiresAt = sessionResponse.data.expiresAt;

          if (new Date(expiresAt) < new Date()) {
            router.push("/user-login");
            return;
          }

          if (token && userId) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userId", userId);
          }
        }

        setAuthToken(token);
        console.log("Token Set in Axios:", api.defaults.headers.common["Authorization"]);

        const profileResponse = await api.get(`/users/profile/${userId}`);
        setProfile(profileResponse.data);
      } catch (error) {
        console.error("Session Fetch Error:", error);
        router.push("/user-login");
      }
    };

    fetchUserData();
  }, [router]);

  if (!profile) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
          <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
        </div>
        <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">Name: {profile.firstName} {profile.lastName}</p>
              <p className="text-sm">Email: {profile.email}</p>
              <p className="text-sm">Phone: {profile.phone}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
