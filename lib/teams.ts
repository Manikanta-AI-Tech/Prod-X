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
 * Flatten nested Supabase count objects into plain numbers.
 */
function flattenNestedCount(val: unknown): number {
  if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
    const c = (val[0] as Record<string, unknown>).count;
    if (typeof c === "number") return c;
  }
  if (typeof val === "number") return val;
  return 0;
}

/**
 * Flatten a nested join result to extract a single name string.
 * Supabase returns [{name: "..."}] for joined relations.
 */
function flattenNestedName(val: unknown): string | undefined {
  if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
    return (val[0] as Record<string, unknown>).name as string | undefined;
  }
  if (typeof val === "string") return val;
  return undefined;
}

function flattenTeam(row: Record<string, unknown>): Team {
  return {
    id: row.id as string,
    name: row.name as string,
    cohort_id: row.cohort_id as string | null,
    product_id: row.product_id as string | null,
    mentor_id: row.mentor_id as string | null,
    description: row.description as string | null,
    progress: row.progress as number,
    status: row.status as TeamStatus,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    member_count: flattenNestedCount(row.member_count),
    cohort_name: undefined,
    product_name: undefined,
    mentor_name: undefined,
    members: Array.isArray(row.members) ? (row.members as TeamMember[]) : undefined,
  };
}

const TEAM_SELECT = `
  *,
  member_count: team_members(count)
`;

const TEAM_DETAIL_SELECT = `
  *,
  member_count: team_members(count),
  members:team_members(*)
`;

/**
 * List teams with optional filters, search, and member count.
 */
export async function listTeams(filters?: TeamFilters) {
  let query = supabase
    .from("teams")
    .select(TEAM_SELECT, { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.search) {
    const term = `%${filters.search}%`;
    // Use the raw id-based filter since Supabase joins via !inner may not support cross-table or
    query = query.or(`name.ilike.${term}`);
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return {
    data: (data as Record<string, unknown>[]).map(flattenTeam),
    count: count ?? 0,
  };
}

/**
 * Get a single team by ID with full details.
 */
export async function getTeam(id: string) {
  const { data, error } = await supabase
    .from("teams")
    .select(TEAM_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return flattenTeam(data as Record<string, unknown>);
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