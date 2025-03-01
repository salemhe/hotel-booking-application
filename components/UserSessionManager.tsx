"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode"; // Make sure to install this package
import { useRouter } from "next/navigation"

// Define types for better type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

interface DecodedToken {
  userId: string;
  exp: number;
  [key: string]: string | number | boolean;
}

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
}

interface SessionResponse {
  message: string;
  session: {
    userId: string;
    token: string;
    expiresAt: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface LoginResponse {
  message: string;
  token: string;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a UserSessionManager");
  }
  return context;
};

interface UserSessionManagerProps {
  children: ReactNode;
}

const UserSessionManager: React.FC<UserSessionManagerProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  
  const BASE_URL = "https://hotel-booking-app-backend-30q1.onrender.com";

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        
        if (storedToken) {
          // Verify token is valid and not expired
          try {
            const decoded = jwtDecode<DecodedToken>(storedToken);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp > currentTime) {
              setToken(storedToken);
              await fetchUserProfile(decoded.userId, storedToken);
              setIsAuthenticated(true);
            } else {
              // Token expired, clean up
              await logout();
            }
          } catch (error) {
            console.error("Token validation error:", error);
            await logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (userId: string, authToken: string): Promise<User> => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      
      const userData: User = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  const createSession = async (userId: string, authToken: string): Promise<SessionResponse> => {
    try {
      // Calculate expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const response = await fetch(`${BASE_URL}/api/sessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          token: authToken,
          expiresAt: expiresAt.toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to create session");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const data: LoginResponse = await response.json();
      const authToken = data.token;
      
      // Save token to localStorage
      localStorage.setItem("authToken", authToken);
      setToken(authToken);
      
      // Decode token to get user ID
      const decoded = jwtDecode<DecodedToken>(authToken);
      
      // Create session in backend
      await createSession(decoded.userId, authToken);
      
      // Fetch user profile
      const userProfile = await fetchUserProfile(decoded.userId, authToken);
      
      setIsAuthenticated(true);
      return userProfile;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (user && token) {
        // Get session ID if needed
        // For now, we'll just clear client-side session
      }
      
      // Clear user data and auth state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      router.push("/user-login")
      // You could also call an API endpoint to invalidate the session on the server
      // await fetch(`${BASE_URL}/api/sessions/delete/${sessionId}`, ...);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkAuth = (): boolean => {
    return isAuthenticated;
  };

  const contextValue: SessionContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export default UserSessionManager;
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