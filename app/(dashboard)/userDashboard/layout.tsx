import Header from "@/app/components/headers/UserHeader";
import { AppSidebar } from "@/app/components/sidebars/UserSidebar";
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar";
import { Toaster } from "@/app/components/ui/toaster";
import SessionManager from "@/app/components/UserSessionManager";
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
