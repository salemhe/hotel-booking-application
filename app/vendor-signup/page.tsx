"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Store, Mail, Lock, User, Building2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VendorSignupPage() {
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"super-admin" | "vendor">("vendor") // Default to vendor
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulated API call - store user info in localStorage
      localStorage.setItem("user", JSON.stringify({ email, role }))
      router.push("/vendor-login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6 px-6">
            <div className="flex justify-center mb-2">
              <Store className="h-12 w-12 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Create Vendor Account
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                  Business Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Business Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="business@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/60"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setRole("vendor")}
                    className={`w-1/2 flex items-center justify-center gap-2 ${role === "vendor" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
                  >
                    <Store className="h-4 w-4" />
                    Vendor
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setRole("super-admin")}
                    className={`w-1/2 flex items-center justify-center gap-2 ${role === "super-admin" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
                  >
                    <User className="h-4 w-4" />
                    Super Admin
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs sm:text-sm text-gray-500 font-medium">OR</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            <Link 
              href="/vendor-login"
              className="inline-flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm sm:text-base font-medium group"
            >
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              Already have an account? Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
