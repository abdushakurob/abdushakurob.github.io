import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Don't protect the login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for auth token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Decode the token
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if user is admin
      if (decoded.role !== 'admin') {
        // Redirect to login if not admin
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // Allow access to admin routes
      return NextResponse.next();
    } catch (e) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Continue for non-admin routes
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/admin/:path*'],
}; 