import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DEVELOPMENT_CONFIG } from './lib/config/constants';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Skip auth check in development
  if (process.env.NODE_ENV === 'development') {
    return res;
  }

  const supabase = createMiddlewareClient({ 
    req, 
    res,
    options: {
      supabaseUrl: DEVELOPMENT_CONFIG.supabaseUrl,
      supabaseKey: DEVELOPMENT_CONFIG.supabaseKey,
    }
  });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Redirect authenticated users away from auth pages
    if (session && (
      req.nextUrl.pathname === '/login' || 
      req.nextUrl.pathname === '/signup' ||
      req.nextUrl.pathname === '/forgot-password'
    )) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect unauthenticated users away from protected pages
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password'],
};