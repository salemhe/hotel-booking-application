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
  // CircleHelp,
  // MessageSquareMore, 
  Bed,
   Settings,
   BookOpen,
   LogOut,
} from "lucide-react"
// import { BsImage } from "react-icons/bs";
import { PiHandCoinsLight } from "react-icons/pi";
// import { MdOutlineBarChart } from "react-icons/md";
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
import { useRouter } from "next/navigation";
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
  // const [loading, setLoading] = useState(true)

  console.log(profile)
  const isHotel = profile?.businessType === "hotel"
  const isRestaurant = profile?.businessType === "Restaurant " || profile?.businessType === "restaurant"
    console.log(isHotel, isRestaurant, "isHotel, isRestaurant")

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        // setLoading(true)
        
        // Get the user data from AuthService
        const user = AuthService.getUser()
        if (!user) {
          console.warn("No user found in storage")
          // setLoading(false)
          return
        }

        // Get the token
        // c
        // if (!token) {
        //   console.warn("No token found")
        //   setLoading(false)
        //   return
        // }
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
        // setLoading(false)
      }
    }
    
    fetchVendorData()
  }, [])
  console.log(profile, "profile");
  
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push("/vendor-login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };
  const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Bookies",
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
      icon: Home,
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
      icon: LayoutDashboard,
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
      title: isHotel ? "Hotel Listings" : isRestaurant ? "Restaurant Listings" : "My Listings",
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
      title: isHotel ? "Hotel Bookings" : isRestaurant ? "Restaurant Bookings" : "Restaurant Bookings",
      url: isHotel ? "/vendorDashboard/hotel-reservations" : isRestaurant ? "/vendorDashboard/restaurantBookings"  : "/vendorDashboard/restaurantBookings",
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
    // {
    //   name: "Support & Dispute Resolution",
    //   url: "/vendorDashboard/support",
    //   icon: CircleHelp,
    // },
    {
      name: "Settings",
      url: "/vendorDashboard/setting",
      icon:  Settings,
    },
    {
      name: "Logout",
      icon: LogOut,
      onclick: handleLogout,
    },
  ],
}
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-emerald-950">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-emerald-950">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser
         user={data.user}
          /> */}
          
        <NavProjects projects={data.projects} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}



const Home = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
  >
    <g clipPath="url(#clip0_737_886)">
      <path
        fill="#fff"
        d="M11.023 2.24a1.666 1.666 0 0 0-2.046 0L1.99 7.673c-.627.49-.282 1.494.513 1.494h.83v6.666A1.666 1.666 0 0 0 5 17.5h3.333v-5a1.667 1.667 0 1 1 3.334 0v5H15a1.667 1.667 0 0 0 1.667-1.667V9.167h.83c.794 0 1.14-1.005.513-1.493z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_737_886">
        <path fill="#fff" d="M0 0h20v20H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

