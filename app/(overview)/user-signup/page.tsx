"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { api } from "@/lib/axios-config"
import { toast } from "sonner"
import { AxiosError } from "axios"

export default function UserSignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/register", { ...formData, isVerified: false });

      toast.success("Registration successful! Please verify your email.");
      router.push(`/verify-otp?email=${formData.email}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else if (error instanceof Error) {
        toast.error(error.message || "Registration failed");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>User Sign Up</CardTitle>
          <CardDescription>Create a new user account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit}>
            {["firstName", "lastName", "email", "phone", "password"].map((field) => (
              <div key={field} className="mb-4">
                <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</Label>
                <Input id={field} name={field} type={field === "password" ? "password" : "text"} required onChange={handleChange} />
              </div>
            ))}
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link href="/user-login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}