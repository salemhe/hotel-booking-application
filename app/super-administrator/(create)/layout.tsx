"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { ThemeProvider } from "../(dashboard)/ThemeContext";
import { ProfileProvider } from "../(dashboard)/ProfileContext";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  // Authentication check on mount and when auth state changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      console.log("Super admin layout auth check:", {
        isAuthenticated,
        hasToken: !!token,
        userRole: user?.role,
        loading: authLoading,
      });

      if (!authLoading) {
        if (isAuthenticated && token && user?.role === "super-admin") {
          console.log("Super admin authorization confirmed");
          setAuthorized(true);
          setLoading(false);
        } else {
          console.log("Not authorized as super admin, redirecting to login");
          setAuthorized(false);
          setLoading(false);
          // Use immediate hard navigation for most reliable redirect
          window.location.href = "/vendor-login";
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, user, authLoading, router]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Loading Super Admin Dashboard
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-800"></div>
          </div>
        </div>
      </div>
    );
  }

  // Block rendering if not authorized
  if (!authorized) {
    return null; // Will redirect in useEffect
  }

  return (
    <ThemeProvider>
      <ProfileProvider>
        <div className="flex h-screen bg-gray-50">
          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 `}
          >
            {children}
          </div>
        </div>
      </ProfileProvider>
    </ThemeProvider>
  );
}
