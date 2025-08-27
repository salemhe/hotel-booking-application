import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./app/lib/api/services/userAuth.service";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const isVendor = pathname.startsWith("/vendorDashboard");
  const isSuperAdmin = pathname.startsWith("/super-admin");

  let tokenCookieName = "user-token";
  if (isVendor) tokenCookieName = "vendor-token";
  if (isSuperAdmin) tokenCookieName = "admin-token"; // Using admin token for super-admin

  const token = request.cookies.get(tokenCookieName)?.value;

  const redirectPath = request.nextUrl.pathname + request.nextUrl.search;

  if (!token) {
    let loginPath = "/user-login";
    if (isVendor || isSuperAdmin) loginPath = "/vendor-login";
    const redirectUrl = new URL(loginPath, origin);
    redirectUrl.searchParams.set("redirect", redirectPath);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);

  if (!decoded?.exp || decoded.exp < currentTime) {
      let loginPath = "/user-login";
      if (isVendor || isSuperAdmin) loginPath = "/vendor-login";
      const redirectUrl = new URL(loginPath, origin);
      redirectUrl.searchParams.set("redirect", redirectPath);
      return NextResponse.redirect(redirectUrl);
    }

    // For super-admin redirects, ensure proper handling
    if (isSuperAdmin) {
      // Check if role property exists and is super-admin
      const userRole = decoded.role;
      if (userRole === 'super-admin') {
        // Allow access to super-admin routes
        return NextResponse.next();
      } else {
        // If trying to access super-admin routes but not a super-admin
        return NextResponse.redirect(new URL('/', origin));
      }
    }
  } catch (error) {
    // If token is invalid or can't be decoded, redirect to login
    let loginPath = "/user-login";
    if (isVendor || isSuperAdmin) loginPath = "/vendor-login";
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
