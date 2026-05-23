import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  // If no session cookie and trying to access protected routes
  if (!session && (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If there is a session, and trying to access login/signup
  if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access /admin, we can do a quick check of the JWT payload
  if (session && request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const payloadBase64 = session.value.split('.')[1];
      // Decode base64 to string
      const payloadString = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedToken = JSON.parse(payloadString);
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const isAdmin = decodedToken.admin === true || 
                      (adminEmail && decodedToken.email === adminEmail);
      
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Error decoding session cookie in middleware:', error);
      // Fallback redirect if decoding fails
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/admin/:path*'],
};
