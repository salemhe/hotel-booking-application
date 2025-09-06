"use client";
import Header from "@/app/components/headers/AdminHeader";
import { Sidebar } from "@/app/components/layout/Sidebar";
import AdminBottomNav from "@/app/components/layout/AdminBottomNav";
import { useState } from "react";

import { SidebarProvider } from "@/app/components/ui/sidebar";

export default function OwnerDasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const userRole = "admin";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            userRole={userRole}
          />
        </div>
        {/* Main */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="mt-20 pb-16 md:pb-0">
            {children}
          </main>
        </div>
        {/* Mobile bottom nav */}
        <AdminBottomNav />
      </div>
    </SidebarProvider>
  );
}
