#!/usr/bin/env node
/**
 * Run the 0003 migration to create cohorts, teams, team_members tables.
 * Usage: node scripts/run-migration.mjs
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const sql = `-- Create cohorts table
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  batch_year INTEGER NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated read cohorts" ON cohorts;
DROP POLICY IF EXISTS "Authenticated insert cohorts" ON cohorts;
DROP POLICY IF EXISTS "Authenticated update cohorts" ON cohorts;
DROP POLICY IF EXISTS "Authenticated delete cohorts" ON cohorts;
CREATE POLICY "Authenticated read cohorts" ON cohorts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert cohorts" ON cohorts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update cohorts" ON cohorts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete cohorts" ON cohorts FOR DELETE TO authenticated USING (true);

-- Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  linkedin_url TEXT,
  bio TEXT,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated read mentors" ON mentors;
DROP POLICY IF EXISTS "Authenticated insert mentors" ON mentors;
DROP POLICY IF EXISTS "Authenticated update mentors" ON mentors;
DROP POLICY IF EXISTS "Authenticated delete mentors" ON mentors;
CREATE POLICY "Authenticated read mentors" ON mentors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert mentors" ON mentors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update mentors" ON mentors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete mentors" ON mentors FOR DELETE TO authenticated USING (true);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cohort_id UUID REFERENCES cohorts(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
  description TEXT,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated read teams" ON teams;
DROP POLICY IF EXISTS "Authenticated insert teams" ON teams;
DROP POLICY IF EXISTS "Authenticated update teams" ON teams;
DROP POLICY IF EXISTS "Authenticated delete teams" ON teams;
CREATE POLICY "Authenticated read teams" ON teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert teams" ON teams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update teams" ON teams FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete teams" ON teams FOR DELETE TO authenticated USING (true);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated read team_members" ON team_members;
DROP POLICY IF EXISTS "Authenticated insert team_members" ON team_members;
DROP POLICY IF EXISTS "Authenticated update team_members" ON team_members;
DROP POLICY IF EXISTS "Authenticated delete team_members" ON team_members;
CREATE POLICY "Authenticated read team_members" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert team_members" ON team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update team_members" ON team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete team_members" ON team_members FOR DELETE TO authenticated USING (true);`;

async function run() {
  console.log("Running migration...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Migration failed:", res.status, text);
    process.exit(1);
  }
  console.log("Migration completed successfully!");
}

run().catch(console.error);