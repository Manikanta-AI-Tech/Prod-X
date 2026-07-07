import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const url = request.nextUrl.clone();

  // Protected routes — redirect to /auth if not logged in
  if (!session) {
    if (
      url.pathname.startsWith('/builder') ||
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/mentor') ||
      url.pathname.startsWith('/judge')
    ) {
      url.pathname = '/auth';
      return NextResponse.redirect(url);
    }
    return response;
  }

  // User is logged in — fetch their role from the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const role = profile?.role || 'builder';
  const roleDashboard: Record<string, string> = {
    builder: '/builder',
    mentor: '/mentor',
    judge: '/judge',
    admin: '/admin',
  };

  // Role-based post-login redirect (when hitting /auth while already logged in)
  if (url.pathname === '/auth') {
    url.pathname = roleDashboard[role] || '/builder';
    return NextResponse.redirect(url);
  }

  // Ensure role-appropriate access (optional — block users from wrong dashboards)
  const rolePrefixes: Record<string, string[]> = {
    builder: ['/builder'],
    mentor: ['/mentor'],
    judge: ['/judge'],
    admin: ['/admin', '/mentor', '/builder'],
  };
  const allowedPrefixes = rolePrefixes[role] || ['/builder'];
  const isOnProtectedRoute = url.pathname.startsWith('/builder') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/mentor') ||
    url.pathname.startsWith('/judge');

  if (isOnProtectedRoute) {
    const isAllowed = allowedPrefixes.some(prefix => url.pathname.startsWith(prefix));
    if (!isAllowed) {
      url.pathname = roleDashboard[role] || '/builder';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/builder/:path*', '/admin/:path*', '/mentor/:path*', '/judge/:path*', '/auth'],
};