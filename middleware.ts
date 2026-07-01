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

  // Protected routes
  if (!session && (
    url.pathname.startsWith('/builder') || 
    url.pathname.startsWith('/admin') || 
    url.pathname.startsWith('/mentor')
  )) {
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // Auth page redirect
  if (session && url.pathname === '/auth') {
    url.pathname = '/builder';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/builder/:path*', '/admin/:path*', '/mentor/:path*', '/auth'],
};
