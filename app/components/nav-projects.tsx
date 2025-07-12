"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
//   SidebarGroupLabel,
  SidebarMenu,
//   SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
//   useSidebar,
} from "@/app/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url?: string
    icon: LucideIcon
    onclick?: () => void;
  }[]
}) {
//   const { isMobile } = useSidebar()

  return (
    <SidebarGroup className=" mt-6">
      {/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton onClick={item.onclick} asChild>
              <a href={item.url}>
                <item.icon className="text-gray-200 w-5 h-5"/>
                <span className="font-normal text-[16px]/[24px] tracking-[0.5px] text-gray-200">{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
