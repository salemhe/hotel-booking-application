import Header from "@/components/headers/VendorHeader";
import SessionManager from "@/components/SessionManager";
import { AppSidebar } from "@/components/sidebars/VendorSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import ProtectedRoute from "@/components/ProtectedRoute";


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
            <div className="mt-20">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionManager>
  );
}
