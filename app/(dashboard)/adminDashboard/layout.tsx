"use client";
import Header from "@/components/headers/AdminHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function OwnerDasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Simple state for active section
  const [activeSection, setActiveSection] = useState("dashboard");
  const userRole = "admin";

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="mt-20">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
