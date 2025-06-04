// components/ProtectedRoute.tsx
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from '@/lib/api/services/auth.service';

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole: "super-admin" | "vendor" 
}) {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkRole = () => {
      const userRole = AuthService.getUserRole();
      if (!userRole || !AuthService.isAuthorized([requiredRole])) {
        router.replace("/unauthorized");
      } else {
        setRole(userRole);
      }
    };

    checkRole();
  }, [router, requiredRole]);

  return role ? <>{children}</> : null;
}