import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, role, full_name, team_id } = await req.json();
    if (!email || !role) {
      return NextResponse.json({ error: "email and role are required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      { data: { role, full_name: full_name || email.split("@")[0] } }
    );

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    const userId = authData.user.id;

    if (role === "builder" || role === "mentor") {
      await supabaseAdmin.from("profiles").upsert({
        id: userId, full_name: full_name || email.split("@")[0], email, role, avatar_url: null,
      });
      if (role === "builder" && team_id) {
        await supabaseAdmin.from("team_members").upsert({
          profile_id: userId, team_id, name: full_name || email.split("@")[0], role: "Builder",
        });
      }
    }

    return NextResponse.json({ success: true, user: { id: userId, email, role, full_name }, message: `Invitation sent to ${email}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}