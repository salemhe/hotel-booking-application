// app/vendorDashboard/layout.tsx
import Header from "@/components/headers/VendorHeader";
import { AppSidebar } from "@/components/sidebars/VendorSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SessionManager from "@/components/SessionManager";

export default function VendorDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionManager>
      <div className="flex">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="mt-20">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionManager>
  );
}