"use client"

import { type LucideIcon } from "lucide-react"

import { type IconType } from "react-icons"

// Update the type to accept both icon types
type IconComponent = LucideIcon | IconType

import {
  // Collapsible,
  // CollapsibleContent,
  // CollapsibleTrigger,
} from "@/app/components/ui/collapsible"
import {
  SidebarGroup,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuSub,
  // SidebarMenuSubButton,
  // SidebarMenuSubItem,
} from "@/app/components/ui/sidebar"

import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: IconComponent
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon className="text-gray-200 w-5 h-5" />}
                <span className=" font-normal text-[16px]/[24px] tracking-[0.5px] text-gray-200">{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          // <Collapsible
          //   key={item.title}
          //   asChild
          //   defaultOpen={item.isActive}
          //   className="group/collapsible"
          // >
          //   <SidebarMenuItem>
          //     <CollapsibleTrigger asChild>
          //       <SidebarMenuButton tooltip={item.title}>
          //         {item.icon && <item.icon />}
          //         <span>{item.title}</span>
          //         {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
          //       </SidebarMenuButton>
          //     </CollapsibleTrigger>
          //     <CollapsibleContent>
          //       <SidebarMenuSub>
          //         {item.items?.map((subItem) => (
          //           <SidebarMenuSubItem key={subItem.title}>
          //             <SidebarMenuSubButton asChild>
          //               <a href={subItem.url}>
          //                 <span>{subItem.title}</span>
          //               </a>
          //             </SidebarMenuSubButton>
          //           </SidebarMenuSubItem>
          //         ))}
          //       </SidebarMenuSub>
          //     </CollapsibleContent>
          //   </SidebarMenuItem>
          // </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
