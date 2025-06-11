import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // --- Proteção básica para /admin ---
  const basicAuthPaths = ['/admin','/api/admin'];
  const needsBasicAuth = basicAuthPaths.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix)
  );

  if (needsBasicAuth) {
    const authHeader = req.headers.get('authorization');
    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASS;

    if (!authHeader?.startsWith('Basic ')) {
      return new Response('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      });
    }

    const encoded = authHeader.split(' ')[1];
    const [u, p] = atob(encoded).split(':');

    if (u !== user || p !== pass) {
      return new Response('Invalid credentials', { status: 403 });
    }
  }

  // --- Autenticação Supabase para /dashboard ---
  const supabaseUrlConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKeyConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrlConfigured || !supabaseKeyConfigured) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Supabase não está configurado. Middleware pulado.'
      );
    } else {
      console.error(
        'ALERTA: Supabase URL ou Anon Key não configurados no ambiente.'
      );
    }
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session && (
      req.nextUrl.pathname === '/login' ||
      req.nextUrl.pathname === '/signup' ||
      req.nextUrl.pathname === '/forgot-password'
    )) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error com Supabase:', error);
    return res;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/admin/:path*', // 👈 protege /admin
  ],
};
