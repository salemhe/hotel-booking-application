import Header from "@/components/headers/UserHeader";
import { AppSidebar } from "@/components/sidebars/UserSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import UserSessionManager from "@/components/UserSessionManager";
import { Toaster } from '@/components/ui/toaster';
// import AuthGuard from "@/components/AuthGuard";
import UserSessionManager from "@/components/UserSessionManager";
export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserSessionManager>
      <div className="flex">
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <div className="mt-20">
                {children}
                <Toaster />
              </div>
            </SidebarInset>
        </SidebarProvider>
      </div>
   </UserSessionManager>
  );
}