import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if the request is coming from the admin subdomain
  if (host.startsWith('admin.')) {
    // Skip authentication check for login page
    if (pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }

    // Check for authentication on admin subdomain
    const token = request.cookies.get('auth_token')
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Rewrite the URL path to the admin route
    const url = request.nextUrl.clone()
    url.pathname = `/admin${pathname}`
    return NextResponse.rewrite(url)
  }

  // Return 404 for /admin routes on main domain
  if (pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.next()
}

// Configure the middleware to run on all paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 