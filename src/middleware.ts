import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/',
  '/offer-letter',
  '/offer-letters-dashboard',
  '/certificate',
  '/certificates-dashboard',
]

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const passcode = process.env.PROTECTED_PASSCODE
  const cookiePasscode = request.cookies.get('access_passcode')?.value

  // Check if the current route matches any protected route
  const isProtected = protectedRoutes.some((route) =>
    url.pathname === route || url.pathname.startsWith(route + '/')
  )

  if (isProtected) {
    if (!cookiePasscode || cookiePasscode !== passcode) {
      url.pathname = '/auth/passcode' // redirect to passcode entry page
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', 
    '/offer-letter', 
    '/offer-letter/:path*', 
    '/offer-letters-dashboard', 
    '/offer-letters-dashboard/:path*', 
    '/certificate', 
    '/certificate/:path*', 
    '/certificates-dashboard',
    '/certificates-dashboard/:path*',
  ],
}
