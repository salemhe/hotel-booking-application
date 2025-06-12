// components/SessionManager.tsx
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/app/lib/api/services/auth.service';

export default function SessionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const isValidSession = await AuthService.checkSession();
      if (!isValidSession) {
        router.push('/vendor-login'); 
      }
    };

    checkSession();

    // Set up periodic session checks
    const intervalId = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [router]);

  return <>{children}</>;
}


