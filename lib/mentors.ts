import { supabase } from "./supabase";

export type MentorStatus = "active" | "inactive";

export interface Mentor {
  id: string;
  name: string;
  email: string;
  company: string;
  designation: string;
  expertise: string;
  bio: string;
  linkedin_url: string | null;
  avatar_url: string | null;
  status: MentorStatus;
  assigned_cohorts: string[];
  assigned_teams: string[];
  builders_count: number;
}

export interface MentorInput {
  name: string;
  email: string;
  company: string;
  designation: string;
  expertise: string;
  bio: string;
  linkedin_url?: string | null;
  avatar_url?: string | null;
  status: MentorStatus;
}

export interface MentorFilters {
  search?: string;
  expertise?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export async function getExpertiseOptions(): Promise<string[]> {
  const { data } = await supabase
    .from("mentors")
    .select("expertise")
    .not("expertise", "is", null);
  if (!data) return [];
  return [...new Set(data.map((r: any) => r.expertise).filter(Boolean))].sort();
}

// ---------------------------------------------------------------------------
// Map a Supabase row to the Mentor interface
// ---------------------------------------------------------------------------

function rowToMentor(row: any): Mentor {
  return {
    id: row.id,
    name: row.name ?? "",
    email: row.email ?? "",
    company: row.company ?? "",
    designation: row.role ?? "",
    expertise: row.expertise ?? "",
    bio: row.bio ?? "",
    linkedin_url: row.linkedin_url ?? null,
    avatar_url: row.photo_url ?? null,
    status: row.status ?? "active",
    assigned_cohorts: [],
    assigned_teams: [],
    builders_count: 0,
  };
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function listMentors(
  filters?: MentorFilters
): Promise<{ data: Mentor[]; count: number }> {
  let query = supabase
    .from("mentors")
    .select("*", { count: "exact" })
    .order("name");

  if (filters?.search) {
    const term = `%${filters.search}%`;
    query = query.or(`name.ilike.${term},role.ilike.${term},expertise.ilike.${term}`);
  }

  if (filters?.expertise) {
    query = query.eq("expertise", filters.expertise);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return {
    data: (data as any[]).map(rowToMentor),
    count: count ?? 0,
  };
}

export async function getMentor(id: string): Promise<Mentor> {
  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Mentor not found");
  return rowToMentor(data);
}

export async function createMentor(input: MentorInput): Promise<Mentor> {
  const { data, error } = await supabase
    .from("mentors")
    .insert({
      name: input.name,
      email: input.email,
      company: input.company,
      role: input.designation,
      expertise: input.expertise,
      bio: input.bio,
      linkedin_url: input.linkedin_url ?? null,
      photo_url: input.avatar_url ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToMentor(data);
}

export async function updateMentor(
  id: string,
  input: Partial<MentorInput>
): Promise<Mentor> {
  const updates: Record<string, any> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.email !== undefined) updates.email = input.email;
  if (input.company !== undefined) updates.company = input.company;
  if (input.designation !== undefined) updates.role = input.designation;
  if (input.expertise !== undefined) updates.expertise = input.expertise;
  if (input.bio !== undefined) updates.bio = input.bio;
  if (input.linkedin_url !== undefined) updates.linkedin_url = input.linkedin_url;
  if (input.avatar_url !== undefined) updates.photo_url = input.avatar_url;

  const { data, error } = await supabase
    .from("mentors")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return rowToMentor(data);
}

export async function deleteMentor(id: string): Promise<void> {
  const { error } = await supabase.from("mentors").delete().eq("id", id);
  if (error) throw error;
}