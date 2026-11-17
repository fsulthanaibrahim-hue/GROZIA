import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessRoute } from './lib/permissions';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  if (
    pathname === '/login' || 
    pathname === '/home' ||
    pathname.startsWith('/api') || // We protect APIs in Python
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // 2. Get the user's role. 
  // NOTE: Since your login API sets a cookie, you need to read it here.
  // If your API sets 'access_token' but not the role, you will need to 
  // modify your Python /api/login to ALSO set a non-httpOnly cookie called 'user_role'.
  const userRole = request.cookies.get('user_role')?.value;

  // 3. Redirect to login if not authenticated
  if (!userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Check permissions
  if (!canAccessRoute(userRole, pathname)) {
    // Redirect to a 403 page you create
    return NextResponse.redirect(new URL('/403', request.url));
  }

  return NextResponse.next();
}

// Run this middleware only on the dashboard routes
export const config = {
  matcher: [
    '/products/:path*',
    '/customers/:path*',
    '/complaints/:path*',
    '/settings/:path*',
  ],
};