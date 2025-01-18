import Header from "@/components/headers/AdminHeader";
import { AppSidebar } from "@/components/sidebars/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


export default function OwnerDasboardLayout({
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
