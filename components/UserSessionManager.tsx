"use client";
import { ReactNode, useEffect, useState } from "react";
import { AuthService } from "@/services/userAuth.services";
import { useRouter } from "next/navigation";

const SessionManager = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isValid = AuthService.isAuthenticated();
        setIsAuthenticated(isValid);
        console.log(isValid);

        if (!isValid) {
          await AuthService.logout();
          router.push("/user-login");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">
        </div>
      </div>
    );
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default SessionManager;
// "use client";

// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { AuthService, UserProfile } from '@/services/userAuth.services';
// import { toast } from '@/components/ui/use-toast';

// interface SessionContextProps {
//   user: UserProfile | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<UserProfile>;
//   logout: () => Promise<void>;
// }
// const SessionContext = createContext<SessionContextProps | undefined>(undefined);

// export const useSession = () => {
//   const context = useContext(SessionContext);
//   if (!context) {
//     console.error("⚠️ useSession() was called outside of UserSessionManager!");
//     return {
//       user: null,
//       isAuthenticated: false,
//       isLoading: true,
//       login: async () => { throw new Error("Session not initialized"); },
//       logout: async () => {},
//     };
//   }
//   return context;
// };

// export const UserSessionManager = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   // Protected routes configuration
//   const protectedRoutes = ['/userDashboard', '/profile', '/settings'];
//   const authRoutes = ['/user-login', '/user-signup', '/forgot-password'];

//   const checkAuthAndRedirect = async () => {
//     try {
//       setIsLoading(true);

//       const isValid = await AuthService.checkSession();

//       setIsAuthenticated(isValid);
//       setUser(AuthService.getUser());

//       // Redirect to login if accessing protected route without auth
//       if (!isValid && protectedRoutes.some(route => pathname?.startsWith(route))) {
//         router.push('/user-login');
//       }

//       // Redirect to dashboard if accessing auth route with auth
//       if (isValid && authRoutes.includes(pathname || '')) {
//         router.push('/userDashboard');
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuthAndRedirect();

//     // Listen for auth errors
//     const handleAuthError = () => {
//       setIsAuthenticated(false);
//       setUser(null);
//       router.push('/user-login');
//       toast({
//         title: "Session expired",
//         description: "Please log in again to continue",
//         variant: "destructive"
//       });
//     };

//     window.addEventListener('auth-error', handleAuthError);

//     return () => {
//       window.removeEventListener('auth-error', handleAuthError);
//     };
//   }, [pathname, router]);

//   const login = async (email: string, password: string): Promise<UserProfile> => {
//     try {
//       const userProfile = await AuthService.login(email, password);
//       setUser(userProfile);
//       setIsAuthenticated(true);
//       return userProfile;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = async (): Promise<void> => {
//     try {
//       await AuthService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//       router.push('/user-login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//       throw error;
//     }
//   };

//   return (
//     <SessionContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         isLoading,
//         login,
//         logout
//       }}
//     >
//       {children}
//     </SessionContext.Provider>
//   );
// };

// export default UserSessionManager;
