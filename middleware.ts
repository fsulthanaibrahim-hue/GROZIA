import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  if (
    pathname === '/login' ||
    pathname === '/403' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    if (token) return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Page permissions are enforced by the dashboard layout (from /api/me)
  // and by the API itself, never from a cookie the user can edit.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
