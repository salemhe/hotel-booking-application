// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { AuthService } from '@/services/auth.services'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/vendor-login', request.url)) 
  }
  
  // Add role-based route protection here if needed
  return NextResponse.next()
}

export const config = {
  matcher: ['/vendorDashboard/:path*']
}