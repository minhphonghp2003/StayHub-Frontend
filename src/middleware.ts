import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh");

  const response = NextResponse.next();

  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  response.cookies.set("refresh", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/signup', '/signin'],
}