import Header from "@/app/components/headers/VendorHeader";
import SessionManager from "@/app/components/SessionManager";
import { AppSidebar } from "@/app/components/sidebars/VendorSidebar";
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar";
import { VendorProvider } from "@/app/contexts/VendorContext";
// import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function VendorDasboardLayout({
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
            <VendorProvider>
              <div className="mt-20">{children}</div>
            </VendorProvider>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionManager>
  );
}
