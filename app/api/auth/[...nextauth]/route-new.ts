import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.role) {
            throw new Error("Missing credentials");
          }

          let userResponse;

          if (credentials.role === "personal") {
            userResponse = await axios.post(
              `${BASE_URL}/api/users/login`,
              {
                email: credentials.email,
                password: credentials.password,
              }
            );
          } else if (credentials.role === "business") {
            userResponse = await axios.post(
              `${BASE_URL}/api/vendors/login`,
              {
                email: credentials.email,
                password: credentials.password,
              }
            );
          } else {
            throw new Error("Invalid role");
          }

          const userData = userResponse?.data;
          if (!userData?.token) {
            return null;
          }

          return {
            id: String(userData.id),
            email: credentials.email as string,
            token: userData.token,
            role: credentials.role,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "your-secret-key",
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
