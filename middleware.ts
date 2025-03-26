import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl

  // Check if the request is coming from the admin subdomain
  if (host.startsWith('admin.')) {
    // Rewrite the URL path to the admin route group
    const url = request.nextUrl.clone()
    url.pathname = `/(admin)${pathname}`
    return NextResponse.rewrite(url)
  }

  // Handle authentication for admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on all paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 