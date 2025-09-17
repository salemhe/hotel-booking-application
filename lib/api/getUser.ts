import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth";

export async function getUserFromToken(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    // Verify token with your JWT_SECRET
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
}
