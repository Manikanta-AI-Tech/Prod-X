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

  const pathnameShort = pathname.substring(0, 40);
  if (!session) {
    console.log(`[AUTH-DIAG] middleware: NO SESSION for path=${pathnameShort} | redirecting to /auth`);
    response = NextResponse.redirect(new URL("/auth", request.url));
    return response;
  }

  console.log(`[AUTH-DIAG] middleware: SESSION FOUND userId=${session.user.id} email=${session.user.email} path=${pathnameShort}`);

  const role = session.user.user_metadata?.role;
  console.log(`[AUTH-DIAG] middleware: role=${role} from user_metadata`);

  if (!role) {
    console.log(`[AUTH-DIAG] middleware: NO ROLE — redirecting to /auth`);
    response = NextResponse.redirect(new URL("/auth", request.url));
    return response;
  }

  if (role === "admin") {
    console.log(`[AUTH-DIAG] middleware: admin access granted to ${pathnameShort} — proceeding`);
    return response;
  }

  const allowed = roleRoutes[role] || [];
  if (!allowed.some(p => pathname.startsWith(p))) {
    const dest = allowed[0] || "/auth";
    console.log(`[AUTH-DIAG] middleware: role=${role} not allowed on ${pathnameShort} — redirecting to ${dest}`);
    response = NextResponse.redirect(new URL(dest, request.url));
    return response;
  }

  console.log(`[AUTH-DIAG] middleware: ${role} access granted to ${pathnameShort} — proceeding`);
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
