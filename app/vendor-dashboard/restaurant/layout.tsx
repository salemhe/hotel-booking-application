import SidebarShell from "./SidebarShell";

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell>{children}</SidebarShell>;
} 
