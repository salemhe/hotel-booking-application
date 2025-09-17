"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

const getCurrentYear = () => new Date().getFullYear();

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleRegister = () => {
    if (formValidation()) {
      setError({ name: "", email: "", password: "", confirmPassword: "" })
      console.log("Registering with:", formData)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    if (password.length >= 12) strength++
    return strength
  }

  const strength = getPasswordStrength(formData.password)

  const formValidation = () => {
    // Basic validation logic
    if (!formData.name) {
      setError((prev) => ({ ...prev, name: "Name is required." }))
      return false
    }
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: "Email is required." }))
      return false
    }
    if (!formData.password) {
      setError((prev) => ({ ...prev, password: "Password is required." }))
      return false
    }
    if (formData.password.length < 8) {
      setError((prev) => ({ ...prev, password: "Password must be at least 8 characters." }))
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }))
      return false
    }
    return true
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  return (
        <div className="min-h-screen flex items-center justify-center ">
          <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center">
                </div>
                <span className="text-xl font-semibold text-gray-900">Rhace</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create an Account</h1>
              <p className="text-sm text-gray-600">Join now to streamline your experience from day one.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  placeholder="John Doe"
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full"
                />
                {error.name && <p className="text-sm text-red-600 mt-1">{error.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full"
                />
                {error.email && <p className="text-sm text-red-600 mt-1">{error.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="********"
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error.password && <p className="text-sm text-red-600 mt-1">{error.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    placeholder="********"
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error.confirmPassword && <p className="text-sm text-red-600 mt-1">{error.confirmPassword}</p>}
              </div>
              {formData.password && (
                <div className="w-full mt-2">
                  <PasswordStrengthMeter strength={strength} />
                </div>
              )}
              <Button disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || strength < 3} onClick={handleRegister} className="w-full bg-[#0A6C6D] hover:bg-[#085253] text-white font-medium py-2.5 mt-6">Register</Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <p className="text-sm text-center text-gray-600">
                Already Have An Account?{" "}
                <a href="/auth/user/login" className="text-blue-600 hover:underline font-medium">
                  Sign In
                </a>
              </p>
              <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs text-gray-500">
                <span>Copyright © {getCurrentYear()} Rhace Enterprises LTD.</span>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
  )
}

export default Signup

const PasswordStrengthMeter = ({ strength }: { strength: number }) => {


  const getStrengthLabel = (score: number) => {
    if (score <= 2) return "Weak"
    if (score <= 4) return "Medium"
    return "Strong"
  }

  const getStrengthColor = (score: number) => {
    if (score <= 2) return "bg-red-600"
    if (score <= 4) return "bg-yellow-600"
    return "bg-green-600"
  }

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center">
        <div className={`h-2 w-full rounded ${getStrengthColor(strength)}`} />
        <span className="ml-2 text-sm font-medium">{getStrengthLabel(strength)}</span>
      </div>
      <div className="flex flex-col justify-between text-xs text-gray-500">
        <span>Password must be at least 8 characters long</span>
        <span>Include uppercase and lowercase letters</span>
        <span>Include numbers</span>
        <span>Include symbols</span>
        <span>Longer passwords are stronger</span>
      </div>
    </div>
  )
}
