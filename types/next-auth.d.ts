import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;  // Adding custom `role`
    token?: string; // Adding custom `token`
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
    error: string;
  }
}
