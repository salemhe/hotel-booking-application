// components/SessionManager.tsx
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/api/services/auth.service';

export default function SessionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const isValidSession = await AuthService.checkSession();
      if (!isValidSession) {
        router.push('/vendor-login'); 
        return;
      }
      // Check role and redirect super-admins
      const role = AuthService.getUserRole && AuthService.getUserRole();
      if (role === "super-admin") {
        router.replace("/super-admin/dashboard");
        return;
      }
      // For other users, you can add onboarding logic here if needed
      // e.g., router.replace("/onboarding");
    };

    checkSession();

    // Set up periodic session checks
    const intervalId = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [router]);

  return <>{children}</>;
}


