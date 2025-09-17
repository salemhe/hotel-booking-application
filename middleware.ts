import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./types/auth";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const isVendor = pathname.startsWith("/dashboard/vendor");
  const isSuperAdmin = pathname.startsWith("/super-admin");

  const token = request.cookies.get("token")?.value;

  const redirectPath = request.nextUrl.pathname + request.nextUrl.search;

  if (!token) {
    let loginPath = "/auth/user/login";
    if (isVendor || isSuperAdmin) loginPath = "/auth/vendor/login";
    const redirectUrl = new URL(loginPath, origin);
    redirectUrl.searchParams.set("redirect", redirectPath);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (!decoded?.exp || decoded.exp < currentTime) {
      let loginPath = "/auth/user/login";
      if (isVendor || isSuperAdmin) loginPath = "/auth/vendor/login";
      const redirectUrl = new URL(loginPath, origin);
      redirectUrl.searchParams.set("redirect", redirectPath);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (decoded.role !== "user" && isVendor) {
      const redirectUrl = new URL("/auth/vendor/login", origin);
      redirectUrl.searchParams.set("redirect", redirectPath);
      return NextResponse.redirect(redirectUrl);
    }
    console.log("Token decoded", decoded)

  } catch {
    // If token is invalid or can't be decoded, redirect to login
    let loginPath = "/auth/user/login";
    if (isVendor || isSuperAdmin) loginPath = "/auth/vendor/login";
    const redirectUrl = new URL(loginPath, origin);
    redirectUrl.searchParams.set("redirect", redirectPath);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vendorDashboard/:path*",
    "/userDashboard/:path*",
    "/restaurants/:id/reservations",
    "/super-admin/:path*",
  ],
};
