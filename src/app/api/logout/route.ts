import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/auth/passcode', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  response.cookies.set('access_passcode', '', {
    path: '/',
    expires: new Date(0), // expire the cookie
  })
  return response
}
