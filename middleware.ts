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

  // Create response early so cookie mutations from auth refresh propagate to browser
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: any) { response.cookies.set({ name, value, ...options }); },
        remove(name: string, options: any) { response.cookies.set({ name, value: "", ...options }); },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    response = NextResponse.redirect(new URL("/auth", request.url));
    return response;
  }

  const role = session.user.user_metadata?.role;
  if (!role) {
    response = NextResponse.redirect(new URL("/auth", request.url));
    return response;
  }

  if (role === "admin") return response;

  const allowed = roleRoutes[role] || [];
  if (!allowed.some(p => pathname.startsWith(p))) {
    response = NextResponse.redirect(new URL(allowed[0] || "/auth", request.url));
    return response;
  }

  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
