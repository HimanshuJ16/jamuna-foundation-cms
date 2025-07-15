import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const input = body.input
  const correctPasscode = process.env.PROTECTED_PASSCODE

  if (input === correctPasscode) {
    const response = NextResponse.json({ success: true })
    // Set cookie for access
    response.cookies.set('access_passcode', input, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
