import Header from "@/components/headers/VendorHeader";
import { AppSidebar } from "@/components/sidebars/VendorSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


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
          <div className="mt-20">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
