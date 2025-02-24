import Header from "@/components/headers/VendorHeader";
import { AppSidebar } from "@/components/sidebars/VendorSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import ProtectedRoute from "@/components/ProtectedRoute";


export default function VendorDasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* <ProtectedRoute requiredRole="vendor"> */}
          <div className="mt-20">
            {children}
          </div>
          {/* </ProtectedRoute> */}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
