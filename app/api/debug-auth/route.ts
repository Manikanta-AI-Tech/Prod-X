import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: any) { /* read-only — no writes */ },
        remove(name: string, options: any) { /* read-only — no writes */ },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({
      ok: false,
      sessionExists: false,
      message: "No session found",
      cookieNames: request.cookies.getAll().map(c => c.name) || [],
    });
  }

  // Fetch profile to get role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return NextResponse.json({
    ok: true,
    sessionExists: true,
    userId: session.user.id,
    email: session.user.email,
    profileRole: profile?.role || null,
    userMetadataRole: session.user.user_metadata?.role || null,
  });
}
