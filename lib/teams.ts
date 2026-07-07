import { supabase } from "./supabase";

export type TeamStatus = "active" | "completed" | "paused";

export interface TeamMember {
  id: string;
  team_id: string;
  profile_id: string | null;
  name: string;
  role: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  cohort_id: string | null;
  product_id: string | null;
  mentor_id: string | null;
  description: string | null;
  progress: number;
  status: TeamStatus;
  created_at: string;
  updated_at: string;
  member_count?: number;
  cohort_name?: string;
  product_name?: string;
  mentor_name?: string;
  members?: TeamMember[];
}

export interface TeamInput {
  name: string;
  cohort_id?: string | null;
  product_id?: string | null;
  mentor_id?: string | null;
  description?: string | null;
  progress?: number;
  status?: TeamStatus;
}

export interface TeamFilters {
  search?: string;
  status?: TeamStatus | "all";
}

/**
 * List teams with optional filters, search, and member count.
 */
export async function listTeams(filters?: TeamFilters) {
  let query = supabase
    .from("teams")
    .select(
      `
      *,
      member_count: team_members(count),
      cohort_name:cohorts!cohort_id(name),
      product_name:products!product_id(name),
      mentor_name:mentors!mentor_id(name)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(
      `name.ilike.${searchTerm},cohorts.name.ilike.${searchTerm},products.name.ilike.${searchTerm},mentors.name.ilike.${searchTerm}`
    );
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data as Team[], count: count ?? 0 };
}

/**
 * Get a single team by ID with full details.
 */
export async function getTeam(id: string) {
  const { data, error } = await supabase
    .from("teams")
    .select(
      `
      *,
      member_count: team_members(count),
      cohort_name:cohorts!cohort_id(name),
      product_name:products!product_id(name),
      mentor_name:mentors!mentor_id(name),
      members:team_members(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Team;
}

/**
 * Create a new team.
 */
export async function createTeam(input: TeamInput) {
  const { data, error } = await supabase
    .from("teams")
    .insert({
      name: input.name,
      cohort_id: input.cohort_id ?? null,
      product_id: input.product_id ?? null,
      mentor_id: input.mentor_id ?? null,
      description: input.description ?? null,
      progress: input.progress ?? 0,
      status: input.status ?? "active",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Team;
}

/**
 * Update an existing team.
 */
export async function updateTeam(id: string, input: Partial<TeamInput>) {
  const { data, error } = await supabase
    .from("teams")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Team;
}

/**
 * Delete a team by ID.
 */
export async function deleteTeam(id: string) {
  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) throw error;
}

/**
 * List all cohorts for dropdown select.
 */
export async function listCohortOptions() {
  const { data, error } = await supabase
    .from("cohorts")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data as { id: string; name: string }[];
}

/**
 * List all products for dropdown select.
 */
export async function listProductOptions() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data as { id: string; name: string }[];
}

/**
 * List all mentors for dropdown select.
 */
export async function listMentorOptions() {
  const { data, error } = await supabase
    .from("mentors")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data as { id: string; name: string }[];
}