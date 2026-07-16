import { supabase } from "./supabase";

export type BuilderStatus = "active" | "completed" | "paused";

export interface Builder {
  id: string;
  full_name: string;
  email: string;
  cohort: string;
  team: string;
  product: string;
  role: string;
  progress: number;
  status: BuilderStatus;
  avatar_url: string | null;
}

export interface BuilderInput {
  full_name: string;
  email: string;
  cohort: string;
  team: string;
  product: string;
  role: string;
  progress: number;
  status: BuilderStatus;
  avatar_url?: string | null;
}

export interface BuilderFilters {
  search?: string;
  cohort?: string;
  team?: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockBuilders: Builder[] = [
  { id: "b-1", full_name: "Alex Rivera", email: "alex.rivera@example.com", cohort: "Prod[X] Cohort 2026", team: "Nebula", product: "StellarFlow", role: "Fullstack Engineer", progress: 85, status: "active", avatar_url: null },
  { id: "b-2", full_name: "Sarah Chen", email: "sarah.chen@example.com", cohort: "Prod[X] Cohort 2026", team: "Nebula", product: "StellarFlow", role: "Product Designer", progress: 90, status: "active", avatar_url: null },
  { id: "b-3", full_name: "Marcus Thorne", email: "marcus.thorne@example.com", cohort: "Prod[X] Cohort 2026", team: "Quantum", product: "QuarkDB", role: "Backend Dev", progress: 70, status: "active", avatar_url: null },
  { id: "b-4", full_name: "Elena Rodriguez", email: "elena.rodriguez@example.com", cohort: "Prod[X] Cohort 2026", team: "Quantum", product: "QuarkDB", role: "Frontend Dev", progress: 75, status: "active", avatar_url: null },
  { id: "b-5", full_name: "David Kim", email: "david.kim@example.com", cohort: "Prod[X] Cohort 2026", team: "Apex", product: "FinLens", role: "Fullstack Engineer", progress: 60, status: "active", avatar_url: null },
  { id: "b-6", full_name: "Priya Patel", email: "priya.patel@example.com", cohort: "Prod[X] Cohort 2026", team: "Apex", product: "FinLens", role: "UX Researcher", progress: 65, status: "active", avatar_url: null },
  { id: "b-7", full_name: "Jordan Smyth", email: "jordan.smyth@example.com", cohort: "Prod[X] Cohort 2026", team: "Zenith", product: "LumeOS", role: "Growth Lead", progress: 95, status: "active", avatar_url: null },
  { id: "b-8", full_name: "Leila Vance", email: "leila.vance@example.com", cohort: "Prod[X] Cohort 2026", team: "Zenith", product: "LumeOS", role: "Engineer", progress: 88, status: "active", avatar_url: null },
  { id: "b-9", full_name: "Toby Miller", email: "toby.miller@example.com", cohort: "Prod[X] Cohort 2026", team: "Nebula", product: "StellarFlow", role: "Designer", progress: 82, status: "active", avatar_url: null },
  { id: "b-10", full_name: "Nina Wu", email: "nina.wu@example.com", cohort: "Prod[X] Cohort 2026", team: "Quantum", product: "QuarkDB", role: "Engineer", progress: 78, status: "active", avatar_url: null },
  { id: "b-11", full_name: "Sam Altman", email: "sam.altman@example.com", cohort: "Prod[X] Cohort 2026", team: "Apex", product: "FinLens", role: "Engineer", progress: 55, status: "active", avatar_url: null },
  { id: "b-12", full_name: "Mira Murati", email: "mira.murati@example.com", cohort: "Prod[X] Cohort 2026", team: "Zenith", product: "LumeOS", role: "Designer", progress: 92, status: "active", avatar_url: null },
  { id: "b-13", full_name: "Greg Brockman", email: "greg.brockman@example.com", cohort: "Prod[X] Cohort 2026", team: "Nebula", product: "StellarFlow", role: "Engineer", progress: 89, status: "active", avatar_url: null },
  { id: "b-14", full_name: "Ilya Sutskever", email: "ilya.sutskever@example.com", cohort: "Prod[X] Cohort 2026", team: "Quantum", product: "QuarkDB", role: "Engineer", progress: 81, status: "active", avatar_url: null },
  { id: "b-15", full_name: "Riley Cooper", email: "riley.cooper@example.com", cohort: "Prod[X] Cohort 2026", team: "Beacon", product: "ReviewPilot", role: "Engineer", progress: 60, status: "active", avatar_url: null },
  { id: "b-16", full_name: "Jordan Lee", email: "jordan.lee@example.com", cohort: "Prod[X] Cohort 2026", team: "Beacon", product: "ReviewPilot", role: "Designer", progress: 45, status: "active", avatar_url: null },
  { id: "b-17", full_name: "Morgan Chase", email: "morgan.chase@example.com", cohort: "Prod[X] Cohort 2026", team: "Cascade", product: "WellSync", role: "Engineer", progress: 30, status: "active", avatar_url: null },
  { id: "b-18", full_name: "Taylor Reed", email: "taylor.reed@example.com", cohort: "Prod[X] Cohort 2026", team: "Cascade", product: "WellSync", role: "Designer", progress: 25, status: "active", avatar_url: null },
  { id: "b-19", full_name: "Casey Quinn", email: "casey.quinn@example.com", cohort: "Prod[X] Cohort 2026", team: "Vortex", product: "—", role: "Engineer", progress: 15, status: "paused", avatar_url: null },
  { id: "b-20", full_name: "Riley Cooper", email: "riley.cooper.b@example.com", cohort: "Prod[X] Cohort 2026", team: "Beacon", product: "ReviewPilot", role: "Engineer", progress: 60, status: "completed", avatar_url: null },
];

// ---------------------------------------------------------------------------
// Helpers to extract distinct filter options
// ---------------------------------------------------------------------------

export async function getCohortOptions(): Promise<string[]> {
  const { data } = await supabase.from("cohorts").select("name").order("name");
  if (!data) return [];
  return data.map((r: any) => r.name).filter(Boolean);
}

export async function getTeamOptions(): Promise<string[]> {
  const { data } = await supabase.from("teams").select("name").order("name");
  if (!data) return [];
  return data.map((r: any) => r.name).filter(Boolean);
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * List builders with optional filters (search, cohort, team).
 * Search matches against full_name and email.
 */
export async function listBuilders(
  filters?: BuilderFilters
): Promise<{ data: Builder[]; count: number }> {
  let filtered = [...mockBuilders];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.full_name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q)
    );
  }

  if (filters?.cohort) {
    filtered = filtered.filter((b) => b.cohort === filters.cohort);
  }

  if (filters?.team) {
    filtered = filtered.filter((b) => b.team === filters.team);
  }

  return { data: filtered, count: filtered.length };
}

/**
 * Get a single builder by ID.
 */
export async function getBuilder(id: string): Promise<Builder> {
  const builder = mockBuilders.find((b) => b.id === id);
  if (!builder) throw new Error("Builder not found");
  return { ...builder };
}

let nextId = 100;

/**
 * Create a new builder.
 */
export async function createBuilder(input: BuilderInput): Promise<Builder> {
  const builder: Builder = {
    id: `b-${nextId++}`,
    full_name: input.full_name,
    email: input.email,
    cohort: input.cohort,
    team: input.team,
    product: input.product,
    role: input.role,
    progress: input.progress,
    status: input.status,
    avatar_url: input.avatar_url ?? null,
  };
  mockBuilders.push(builder);
  return { ...builder };
}

/**
 * Update an existing builder.
 */
export async function updateBuilder(
  id: string,
  input: Partial<BuilderInput>
): Promise<Builder> {
  const idx = mockBuilders.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("Builder not found");
  mockBuilders[idx] = { ...mockBuilders[idx], ...input };
  return { ...mockBuilders[idx] };
}

/**
 * Delete a builder by ID.
 */
export async function deleteBuilder(id: string): Promise<void> {
  const idx = mockBuilders.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("Builder not found");
  mockBuilders.splice(idx, 1);
}