import { supabase } from "./supabase";

export interface BuilderProfile {
  id: string;
  full_name: string | null;
  email?: string | null;
  avatar_url: string | null;
  phone: string | null;
  college: string | null;
  degree: string | null;
  graduation_year: number | null;
  city: string | null;
  github_handle: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  bio: string | null;
  skills: string | null;
  xp: number | null;
  role: string | null;
}

export interface BuilderSkill {
  id: string;
  profile_id: string;
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Achievement {
  id: string;
  profile_id: string;
  badge_name: string;
  badge_icon: string;
  description: string | null;
  earned_at: string;
}

export interface Certificate {
  id: string;
  profile_id: string;
  title: string;
  issuer: string;
  certificate_url: string | null;
  issued_at: string;
}

export interface PassportData {
  profile: BuilderProfile | null;
  skills: BuilderSkill[];
  achievements: Achievement[];
  certificates: Certificate[];
  team: { name: string; mentor_name?: string; product_name?: string; cohort_name?: string } | null;
  stats: { xp: number; rank: number; attendance: number; challenges: number; products: number };
}

export async function fetchPassportData(profileId: string): Promise<PassportData> {
  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  // Fetch skills
  const { data: skills } = await supabase
    .from("builder_skills")
    .select("*")
    .eq("profile_id", profileId);

  // Fetch achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("profile_id", profileId)
    .order("earned_at", { ascending: false });

  // Fetch certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", profileId)
    .order("issued_at", { ascending: false });

  // Fetch team info through team_members
  const { data: memberData } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("profile_id", profileId)
    .single();

  let teamInfo = null;
  if (memberData) {
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", memberData.team_id)
      .single();

    if (team) {
      let cohortName: string | undefined;
      let mentorName: string | undefined;
      let productName: string | undefined;

      if (team.cohort_id) {
        const { data: cohort } = await supabase
          .from("cohorts")
          .select("name")
          .eq("id", team.cohort_id)
          .single();
        cohortName = cohort?.name;
      }
      if (team.mentor_id) {
        const { data: mentor } = await supabase
          .from("mentors")
          .select("name")
          .eq("id", team.mentor_id)
          .single();
        mentorName = mentor?.name;
      }
      if (team.product_id) {
        const { data: product } = await supabase
          .from("products")
          .select("name")
          .eq("id", team.product_id)
          .single();
        productName = product?.name;
      }

      teamInfo = {
        name: team.name,
        cohort_name: cohortName,
        mentor_name: mentorName,
        product_name: productName,
      };
    }
  }

  // Stats
  const xp = (profile as any)?.xp ?? 0;

  return {
    profile: profile as BuilderProfile | null,
    skills: (skills as BuilderSkill[]) || [],
    achievements: (achievements as Achievement[]) || [],
    certificates: (certificates as Certificate[]) || [],
    team: teamInfo,
    stats: { xp, rank: 1, attendance: 95, challenges: 3, products: 1 },
  };
}

export async function updateProfile(profileId: string, updates: Partial<BuilderProfile>) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", profileId);
  if (error) throw error;
}

export async function addSkill(profileId: string, name: string, proficiency: string) {
  const { error } = await supabase.from("builder_skills").insert({
    profile_id: profileId,
    name,
    proficiency,
  });
  if (error) throw error;
}

export async function removeSkill(skillId: string) {
  const { error } = await supabase.from("builder_skills").delete().eq("id", skillId);
  if (error) throw error;
}

export async function updateSkill(skillId: string, proficiency: string) {
  const { error } = await supabase.from("builder_skills").update({ proficiency }).eq("id", skillId);
  if (error) throw error;
}