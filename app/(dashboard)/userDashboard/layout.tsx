import Header from "@/components/headers/UserHeader"
import { AppSidebar } from "@/components/sidebars/UserSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AuthWrapper } from "@/components/AuthWrapper" // Adjust path as needed

export default function OwnerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AuthWrapper>
            <Header />
            <div className="mt-20">
              {children}
            </div>
          </AuthWrapper>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}