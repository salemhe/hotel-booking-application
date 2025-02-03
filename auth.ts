// import NextAuth, { User } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import axios from "axios";
// import { createSession } from "./services/sessionService";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     sessionId?: string;
//   }
// }

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//         role: { label: "Role", type: "text" },
//       },
//       authorize: async (credentials) => {
//         try {
//           if (!credentials.email || !credentials.password || !credentials.role) {
//             throw new Error("Missing credentials");
//           }
      
//           let userResponse;
      
//           if (credentials.role === "personal") {
//             userResponse = await axios.post<{ id: string; token: string }>(
//               `${BASE_URL}/api/users/login`,
//               {
//                 email: credentials.email,
//                 password: credentials.password,
//               }
//             );
//           } else if (credentials.role === "business") {
//             userResponse = await axios.post<{ id: string; token: string }>(
//               `${BASE_URL}/api/vendors/login`,
//               {
//                 email: credentials.email,
//                 password: credentials.password,
//               }
//             );
//           } else {
//             throw new Error("Invalid role");
//           }
      
//           const userData = userResponse?.data;
//           if (!userData?.token) {
//             return null;
//           }
      
//           // Return object matching NextAuth `User` type
//           return {
//             id: String(userData.id), // Ensure `id` is a string
//             email: credentials.email,
//             token: userData.token,
//             role: credentials.role,
//           } as User;
//         } catch (error) {
//           console.error("Error during authorization:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth",
//   },
//   callbacks: {
//     async session({ session, token }) {
//       const userId = session.user?.id;
//       if (!userId) {
//         console.error("User ID is missing in the session.");
//         return session;
//       }
  
//       if (typeof token.accessToken !== "string") {
//         console.error("Access token is missing or invalid.");
//         return session;
//       }
  
//       const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1-hour expiration
  
//       try {
//         const res = await createSession(
//           userId,
//           token.accessToken,
//           expiresAt,
//         );
  
//         if (!res || !res.session || !res.session.token || !res.session._id) {
//           console.error("Invalid response from createSession.");
//           return session;
//         }
  
//         session.accessToken = res.session.token;
//         session.sessionId = res.session._id;
//       } catch (error) {
//         console.error("Failed to sync session:", error);
//         session.error = "Failed to sync session";
//       }
//       return session;
//     },
//   },
  
//   secret: process.env.AUTH_SECRET,
// });