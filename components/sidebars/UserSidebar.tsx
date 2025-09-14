"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
//   Map,
//   PieChart,
//   UserCog,
  // LogOut,
//   Settings2,
  LayoutDashboard,
  CircleHelp,
   Settings,
} from "lucide-react"
import { PiHandCoinsLight } from "react-icons/pi";
import { MdOutlineReviews } from "react-icons/md";
import { SlMagnifier } from "react-icons/sl";
import { PiListHeartLight } from "react-icons/pi";

import { IoDocumentTextOutline } from "react-icons/io5";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/app/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
// import Logo from "@/assets/logosaas.png";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "LOGO",
      logo: GalleryVerticalEnd,
      logo2: '/Logo',
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "My Bookings ",
      url: "/userDashboard/booking",
      icon: IoDocumentTextOutline,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Search Restaurants",
      url: "/userDashboard/search",
      icon: SlMagnifier,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    
    {
      title: "Wishlist ",
      url: "/userDashboard/wishlist",
      icon: PiListHeartLight,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Payments & transactions",
      url: "/userDashboard/payment",
      icon: PiHandCoinsLight,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Reviews and Ratings",
      url: "/userDashboard/reviews",
      icon: MdOutlineReviews,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
  projects: [ 
    {
      name: "Suport & Help",
      url: "/userDashboard/help",
      icon: CircleHelp,
    },
    {
      name: "Profile & Setting",
      url: "/userDashboard/setting",
      icon:  Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser
         user={data.user}
          /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
