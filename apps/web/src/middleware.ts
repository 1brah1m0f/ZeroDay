import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/my', '/chat', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes check — client-side auth store handles actual redirect,
  // but we can add SSR cookie-based auth check here in the future
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected) {
    // For now, rely on client-side redirect in layout
    // When implementing httpOnly cookies, add server-side check here
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
