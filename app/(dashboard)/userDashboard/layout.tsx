import Header from "@/components/headers/UserHeader";
import { AppSidebar } from "@/components/sidebars/UserSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import SessionManager from "@/components/UserSessionManager";
// import AuthGuard from "@/app/components/AuthGuard";
export default function UserDashboardLayout({
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
              <Toaster />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionManager>
  );
}
