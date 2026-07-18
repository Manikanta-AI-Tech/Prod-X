import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ["/", "/auth", "/auth/login", "/auth/set-password", "/manifesto", "/_not-found"];

const roleRoutes: Record<string, string[]> = {
  admin: ["/admin"],
  mentor: ["/mentor"],
  builder: ["/builder"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicRoutes.some(r => pathname === r || pathname.startsWith(r + "/"))) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) return NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: any) { request.cookies.set({ name, value, ...options }); },
        remove(name: string, options: any) { request.cookies.set({ name, value: "", ...options }); },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.redirect(new URL("/auth", request.url));

  const role = session.user.user_metadata?.role;
  if (!role) return NextResponse.redirect(new URL("/auth", request.url));
  if (role === "admin") return NextResponse.next();

  const allowed = roleRoutes[role] || [];
  if (!allowed.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL(allowed[0] || "/auth", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };