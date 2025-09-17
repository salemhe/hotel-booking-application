import SidebarShell from "./SidebarShell";

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell>{children}</SidebarShell>;
}
