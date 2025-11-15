import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
export function middleware(request: NextRequest) {
  let isLoggedIn = request.cookies.has('access_token')

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/signup', '/signin'],
}