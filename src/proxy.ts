import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js 16: Middleware is now called "Proxy". Same logic, renamed convention.
export function proxy(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname === '/dashboard' ||
    pathname.startsWith('/admin') ||
    pathname === '/analytics' ||
    pathname === '/profile' ||
    pathname === '/notifications';

  // If no session cookie and trying to access protected routes, send to login
  if (!session && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If session exists and user is on login/signup or the landing page, send to dashboard
  if (session && (pathname === '/' || pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing /admin, do a lightweight check on the JWT payload
  if (session && pathname.startsWith('/admin')) {
    try {
      const payloadBase64 = session.value.split('.')[1];
      const payloadString = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedToken = JSON.parse(payloadString);
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      const isAdmin =
        decodedToken.role === 'admin' ||
        decodedToken.role === 'super_admin' ||
        decodedToken.admin === true ||
        (adminEmail && decodedToken.email === adminEmail);

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Error decoding session cookie in proxy:', error);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/admin/:path*',
    '/dashboard',
    '/analytics',
    '/profile',
    '/notifications',
  ],
};
