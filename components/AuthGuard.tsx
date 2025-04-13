// "use client";
// import { ReactNode, useEffect } from "react";
// import { useSession } from "@/components/UserSessionManager";
// import { useRouter } from "next/navigation";

// interface AuthGuardProps {
//   children: ReactNode;
// }

// const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     // Only redirect once loading is complete and we know the user isn't authenticated
//     if (!isLoading && !isAuthenticated) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, isLoading, router]);

//   // Show loading state while checking authentication
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // Only render children if authenticated
//   return isAuthenticated ? <>{children}</> : null;
// };

// export default AuthGuard;