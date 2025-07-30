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
  if (isSuperAdmin) tokenCookieName = "vendor-token"; // Adjust if you have a dedicated super-admin token

  const token = request.cookies.get(tokenCookieName)?.value;

  const redirectPath = request.nextUrl.pathname + request.nextUrl.search;

  if (!token) {
    let loginPath = "/user-login";
    if (isVendor || isSuperAdmin) loginPath = "/vendor-login";
    const redirectUrl = new URL(loginPath, origin);
    redirectUrl.searchParams.set("redirect", redirectPath);
    return NextResponse.redirect(redirectUrl);
  }

  const decoded = jwtDecode<DecodedToken>(token);
  const currentTime = Math.floor(Date.now() / 1000);

  if (!decoded?.exp || decoded.exp < currentTime) {
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
