"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { api, setAuthToken } from "@/lib/axios-config"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        let token = localStorage.getItem("authToken")
        let userId = localStorage.getItem("userId")

        if (!token || !userId) {
          const sessionResponse = await api.get("/sessions/user")
          token = sessionResponse.data.token
          userId = sessionResponse.data.userId
          const expiresAt = sessionResponse.data.expiresAt

          if (new Date(expiresAt) < new Date()) {
            router.push("/user-login")
            return
          }

          if (token && userId) {
            localStorage.setItem("authToken", token)
            localStorage.setItem("userId", userId)
          }
        }

        setAuthToken(token)
      } catch (error) {
        console.error("Session Check Error:", error)
        router.push("/user-login")
      }
    }

    checkSession()
  }, [router])

  return <>{children}</>
}