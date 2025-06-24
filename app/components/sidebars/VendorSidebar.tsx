"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
//   Map,
  PieChart,
//   UserCog,
  // LogOut,
//   Settings2,
  LayoutDashboard,
  StickyNote,
  CircleHelp,
  // MessageSquareMore, 
  Bed,
   Settings,
   BookOpen,
} from "lucide-react"
// import { BsImage } from "react-icons/bs";
import { PiHandCoinsLight } from "react-icons/pi";
import { MdOutlineBarChart } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useEffect, useState } from "react"

import { AuthService } from "@/app/lib/api/services/auth.service"
// import { api } from '@/lib/axios-config'
import API from '@/app/lib/api/axios'
import { NavMain } from "@/app/components/nav-main"
import { NavProjects } from "@/app/components/nav-projects"
// import { NavUser } from "@/app/components/nav-user"
import { TeamSwitcher } from "@/app/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/components/ui/sidebar"
// import Logo from "@/assets/logosaas.png";

// This is sample data.


export interface VendorProfile {
  _id: string
  name: string
  businessName: string
  businessType: string
  email: string
  phone: string
  address: string
  branch: string
  role: string
  services: string[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const isHotel = profile?.businessType === "hotel"
  const isRestaurant = profile?.businessType === "Restaurant " || profile?.businessType === "restaurant"
    console.log(isHotel, isRestaurant, "isHotel, isRestaurant")

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true)
        
        // Get the user data from AuthService
        const user = AuthService.getUser()
        if (!user) {
          console.warn("No user found in storage")
          setLoading(false)
          return
        }

        // Get the token
        c
        if (!token) {
          console.warn("No token found")
          setLoading(false)
          return
        }
        // Fetch vendors data
        const response = await API.get('/vendors')

        if (response.data && Array.isArray(response.data)) {
          // Find the vendor that matches the logged-in user's email
          const loggedInVendor = response.data.find(
            (vendor: VendorProfile) => vendor.email === user.email
          )

          if (loggedInVendor) {
            setProfile(loggedInVendor)
            console.log(loggedInVendor)
            // Store role in localStorage for ProtectedRoute
            localStorage.setItem("role", loggedInVendor.role)
          } else {
            console.warn("Logged in user not found in vendors list")
          }
        } else {
          console.warn("Invalid vendors data format")
        }
      } catch (error: unknown) {
        console.error("Failed to fetch vendor data:", error)
        interface ApiError {
          response: {
            status: number;
            data: unknown;
          };
        }
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as ApiError;
          console.error("Error response:", apiError.response.status, apiError.response.data);
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchVendorData()
  }, [])
  console.log(profile, "profile");

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
      title: "Dashboard",
      url: "/vendorDashboard",
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
      title: "Perfomance & Insights",
      url: "/vendorDashboard/insights",
      icon: MdOutlineBarChart,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: isHotel ? "Hostel Listings" : isRestaurant ? "Restaurant Listings" : "My Listings",
      url: isHotel ? "/vendorDashboard/hostelListings" : isRestaurant ? "/vendorDashboard/restaurantListings" : "/vendorDashboard/listings",
      icon: StickyNote,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: isHotel ? "Hotel Bookings" : isRestaurant ? "Restaurant Bookings" : "Bookings Management",
      url: isHotel ? "/vendorDashboard/hotel-reservations" : isRestaurant ? "/vendorDashboard/restaurantBookings" : "/vendorDashboard/bookingManagement",
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
      title: "Availability & Pricing",
      url: "/vendorDashboard/pricing",
      icon: PieChart,
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
      title: "Payments & Earnings",
      url: "/vendorDashboard/payment",
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
      title: isRestaurant ? "Manage Menu" : "Manage Rooms",
      url: isRestaurant ? "/vendorDashboard/menu" : "/vendorDashboard/rooms-mangement",
      icon: isRestaurant ? BookOpen : Bed,
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
      name: "Support & Dispute Resolution",
      url: "/vendorDashboard/support",
      icon: CircleHelp,
    },
    {
      name: "Account & Setting",
      url: "/vendorDashboard/setting",
      icon:  Settings,
    },
  ],
}
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
