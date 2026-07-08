import { supabase } from "./supabase";

export type CohortStatus = "upcoming" | "active" | "completed";

export interface Cohort {
  id: string;
  name: string;
  batch_year: number;
  description: string | null;
  start_date: string;
  end_date: string;
  status: CohortStatus;
  created_at: string;
  updated_at: string;
  team_count?: number;
  member_count?: number;
}

export interface CohortInput {
  name: string;
  batch_year: number;
  description?: string | null;
  start_date: string;
  end_date: string;
  status?: CohortStatus;
}

export interface CohortFilters {
  search?: string;
  status?: CohortStatus | "all";
}

/**
 * Flatten nested Supabase count objects into plain numbers.
 * Supabase returns `[{count: 5}]` for subqueries — this extracts the number.
 */
function flattenNestedCount(val: unknown): number {
  if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
    const c = (val[0] as Record<string, unknown>).count;
    if (typeof c === "number") return c;
  }
  if (typeof val === "number") return val;
  return 0;
}

function flattenCohort(row: Record<string, unknown>): Cohort {
  return {
    id: row.id as string,
    name: row.name as string,
    batch_year: row.batch_year as number,
    description: row.description as string | null,
    start_date: row.start_date as string,
    end_date: row.end_date as string,
    status: row.status as CohortStatus,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    team_count: flattenNestedCount(row.team_count),
    member_count: flattenNestedCount(row.member_count),
  };
}

/**
 * List cohorts with optional filters, search, and computed counts.
 */
export async function listCohorts(filters?: CohortFilters) {
  let query = supabase
    .from("cohorts")
    .select(
      `
      *,
      team_count: teams(count),
      member_count: teams(team_members(count))
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return {
    data: (data as Record<string, unknown>[]).map(flattenCohort),
    count: count ?? 0,
  };
}

/**
 * Get a single cohort by ID with team and member counts.
 */
export async function getCohort(id: string) {
  const { data, error } = await supabase
    .from("cohorts")
    .select(
      `
      *,
      team_count: teams(count),
      member_count: teams(team_members(count))
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return flattenCohort(data as Record<string, unknown>);
}

/**
 * Create a new cohort.
 */
export async function createCohort(input: CohortInput) {
  const { data, error } = await supabase
    .from("cohorts")
    .insert({
      name: input.name,
      batch_year: input.batch_year,
      description: input.description ?? null,
      start_date: input.start_date,
      end_date: input.end_date,
      status: input.status ?? "upcoming",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Cohort;
}

/**
 * Update an existing cohort.
 */
export async function updateCohort(id: string, input: Partial<CohortInput>) {
  const { data, error } = await supabase
    .from("cohorts")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Cohort;
}

/**
 * Delete a cohort by ID.
 */
export async function deleteCohort(id: string) {
  const { error } = await supabase.from("cohorts").delete().eq("id", id);
  if (error) throw error;
}

/**
 * List all cohorts for dropdown options.
 */
export async function listCohortOptions() {
  const { data, error } = await supabase
    .from("cohorts")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data as { id: string; name: string }[];
}