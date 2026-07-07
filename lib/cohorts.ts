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
  return { data: data as Cohort[], count: count ?? 0 };
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
  return data as Cohort;
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
export async function updateCohort(
  id: string,
  input: Partial<CohortInput>
) {
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