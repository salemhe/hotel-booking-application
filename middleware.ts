// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DecodedToken } from "./lib/api/services/userAuth.service";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const isVendor = pathname.startsWith("/vendorDashboard");

  const tokenCookieName = isVendor ? "vendor-token" : "user-token";
  const token = request.cookies.get(tokenCookieName)?.value;

  if (!token) {
    const redirectUrl = new URL(isVendor ? "/vendor-login" : "/user-login", origin);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Decode and check token expiration
    const decoded = jwtDecode<DecodedToken>(token);
  const currentTime = Math.floor(Date.now() / 1000);

  if (!decoded?.exp || decoded.exp < currentTime) {
    const redirectUrl = new URL(isVendor ? "/vendor-login" : "/user-login", origin);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/vendorDashboard/:path*", "/userDashboard/:path*"],
};
