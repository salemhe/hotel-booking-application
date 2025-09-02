"use client"
import React, { useEffect, useState } from 'react'
// import {
//   SidebarTrigger,
// } from "@/app/components/ui/sidebar"
import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { AuthService } from "@/app/lib/api/services/auth.service"
import { ArrowLeft, BellDot, ChevronDown, LogOut } from "lucide-react"
import { useRouter } from 'next/navigation'
// import { api } from '@/lib/axios-config'
import WebSocketStatus from '@/app/components/WebSocketStatus'
import API from '@/app/lib/api/axios'

export interface VendorProfile {
  _id: string
  name: string
  businessName: string
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

function Header() {
  const router = useRouter()
  
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)

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
        const token = AuthService.getToken()
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

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await AuthService.logout()
      router.push("/vendor-login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const getInitials = () => {
    if (profile?.businessName) {
      const nameParts = profile.businessName.split(' ')
      return nameParts.length > 1 
        ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0).toUpperCase()}`
        : profile.businessName.charAt(0).toUpperCase()
    }
    return "V"
  }

  return (
    <header className="flex h-20 items-center gap-2 w-full bg-white z-10 border-b border-gray-100 group-has-data-[collapsible=icon]/sidebar-wrapper:pr-12 transition-[width,height] ease-linear fixed group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex items-center justify-between gap- px-4 w-full">
        <div className="flex items-center justify-center gap-3">
          {/* <SidebarTrigger className="-ml-1" /> */}
          <span></span>
          <div className="flex items-center justify-center gap-16">
            <h3 className="font-semibold space-x-2 flex text-[20px]/[30px] tracking-[0.15px] text-[#0a0a0a]">
             <div className="rounded-full  bg-[#b3d1d2] w-7 h-7"></div> <span>Bookies</span> 
            </h3>
            <div className="font-semibold space-x-2 flex items-center justify-center text-[16px]/[21px] tracking-[0.25px] text-[#111827]">
              <ArrowLeft onClick={() => {router.push("/vendor-dashboard/hotel/rooms-mangement")}}/> <span>Add new Hotel</span> 
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4">
          <WebSocketStatus className="mr-2" />
          <BellDot />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2">
                <div className="bg-gray-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {loading ? "..." : getInitials()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs text-muted-foreground">
                    {loading ? "" : (profile?.businessName || "Business")}
                  </p>
                  <p className="text-sm font-medium">
                    {loading ? "Loading..." : `Hi, ${profile?.name || "Vendor"}`}
                  </p>
                  
                </div>
                <div className="w-8 h-8 rounded-ful flex items-center justify-center">
                  <ChevronDown className="" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header
