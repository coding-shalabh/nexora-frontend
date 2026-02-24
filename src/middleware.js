import { NextResponse } from 'next/server';

/**
 * Next.js middleware for subdomain routing.
 * aka.nexoraos.pro → rewrites to /super-admin/* internally
 */
export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Detect aka subdomain (aka.nexoraos.pro or aka.localhost:3001)
  const isAdminSubdomain = host.startsWith('aka.') || host === 'aka.nexoraos.pro';

  if (isAdminSubdomain) {
    // Already on a super-admin path — don't double-rewrite
    if (url.pathname.startsWith('/super-admin')) {
      return NextResponse.next();
    }

    // Rewrite / → /super-admin, /login → /super-admin/login, etc.
    const pathname = url.pathname === '/' ? '/super-admin' : `/super-admin${url.pathname}`;
    url.pathname = pathname;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
