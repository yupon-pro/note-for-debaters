import NextAuth from 'next-auth';
import { authConfig } from './config/auth.config';
import { NextRequest, NextResponse } from 'next/server';

export default NextAuth(authConfig).auth;

export function middleware(request: NextRequest){
  const res = NextResponse.next();
  const isOnResetPage = request.nextUrl.pathname.includes("/auth/reset/");

  if(isOnResetPage){
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("X-Content-Type-Options", "nosniff");
    // [Notion]
    // Because token may be saved in browser's record or referer header,
    // the manipulation of header prevents the browser from saving the token.
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}