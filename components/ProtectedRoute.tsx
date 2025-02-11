"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole: "super-admin" | "vendor" }) {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    if (!storedRole || storedRole !== requiredRole) {
      router.replace("/unauthorized")
    } else {
      setRole(storedRole)
    }
  }, [router, requiredRole])

  return role ? <>{children}</> : null
}
