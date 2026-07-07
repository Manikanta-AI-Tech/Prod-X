-- Create cohorts table
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
CREATE POLICY "Authenticated read cohorts" ON cohorts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert cohorts" ON cohorts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update cohorts" ON cohorts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete cohorts" ON cohorts FOR DELETE TO authenticated USING (true);

-- Create mentors table (if not exists from previous migration)
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
CREATE POLICY "Authenticated read mentors" ON mentors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert mentors" ON mentors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update mentors" ON mentors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete mentors" ON mentors FOR DELETE TO authenticated USING (true);

-- Seed mentors
INSERT INTO mentors (name, role, company, bio, sort_order) VALUES
  ('Sarah Kim', 'Lead Mentor', 'LeapStart', 'Full-stack engineer and product mentor with 10+ years building SaaS products.', 1),
  ('Marcus Chen', 'Partner', 'PioneerVC', 'VC partner focused on early-stage developer tools and infrastructure.', 2),
  ('Lisa Park', 'CTO', 'SyncWave', 'CTO who has led 3 startups to acquisition.', 3),
  ('Jason Fried', 'Product Design Mentor', 'Basecamp', 'Simplicity advocate and product design mentor.', 4)
ON CONFLICT DO NOTHING;

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
CREATE POLICY "Authenticated read team_members" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert team_members" ON team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update team_members" ON team_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete team_members" ON team_members FOR DELETE TO authenticated USING (true);

-- Seed cohorts
INSERT INTO cohorts (name, batch_year, description, start_date, end_date, status) VALUES
  ('Prod[X] Cohort 2026', 2026, 'The inaugural Prod[X] builder cohort. 14 teams building real products over 10 days.', '2026-06-01', '2026-06-10', 'active')
ON CONFLICT DO NOTHING;

-- Seed teams (with product references matching seed data from migration 0001)
INSERT INTO teams (name, cohort_id, product_id, mentor_id, description, progress, status) VALUES
  ('Team Nebula', (SELECT id FROM cohorts LIMIT 1), (SELECT id FROM products WHERE name = 'StellarFlow' LIMIT 1), (SELECT id FROM mentors WHERE name = 'Sarah Kim' LIMIT 1), 'Building AI-powered workflow automation platform', 92, 'active'),
  ('Team Quantum', (SELECT id FROM cohorts LIMIT 1), (SELECT id FROM products WHERE name = 'QuarkDB' LIMIT 1), (SELECT id FROM mentors WHERE name = 'Marcus Chen' LIMIT 1), 'Building real-time database for collaborative apps', 78, 'active'),
  ('Team Zenith', (SELECT id FROM cohorts LIMIT 1), (SELECT id FROM products WHERE name = 'LumeOS' LIMIT 1), (SELECT id FROM mentors WHERE name = 'Lisa Park' LIMIT 1), 'Building remote team wellness platform', 85, 'active'),
  ('Team Apex', (SELECT id FROM cohorts LIMIT 1), (SELECT id FROM products WHERE name = 'FinLens' LIMIT 1), (SELECT id FROM mentors WHERE name = 'Jason Fried' LIMIT 1), 'Building personal finance analytics dashboard', 45, 'active'),
  ('Team Beacon', (SELECT id FROM cohorts LIMIT 1), (SELECT id FROM products WHERE name = 'ReviewPilot' LIMIT 1), (SELECT id FROM mentors WHERE name = 'Sarah Kim' LIMIT 1), 'Building automated code review assistant', 60, 'active'),
  ('Team Cascade', (SELECT id FROM cohorts LIMIT 1), (SELECT id FROM products WHERE name = 'WellSync' LIMIT 1), (SELECT id FROM mentors WHERE name = 'Marcus Chen' LIMIT 1), 'Building cross-team scheduling tool', 30, 'active'),
  ('Team Vortex', (SELECT id FROM cohorts LIMIT 1), NULL, (SELECT id FROM mentors WHERE name = 'Lisa Park' LIMIT 1), 'Building real-time data visualization platform', 15, 'paused')
ON CONFLICT DO NOTHING;

-- Seed team members
INSERT INTO team_members (team_id, name, role) VALUES
  ((SELECT id FROM teams WHERE name = 'Team Nebula'), 'Alex Rivera', 'Fullstack Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Nebula'), 'Sarah Chen', 'Product Designer'),
  ((SELECT id FROM teams WHERE name = 'Team Nebula'), 'Toby Miller', 'Designer'),
  ((SELECT id FROM teams WHERE name = 'Team Nebula'), 'Greg Brockman', 'Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Quantum'), 'Marcus Thorne', 'Backend Dev'),
  ((SELECT id FROM teams WHERE name = 'Team Quantum'), 'Elena Rodriguez', 'Frontend Dev'),
  ((SELECT id FROM teams WHERE name = 'Team Quantum'), 'Nina Wu', 'Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Quantum'), 'Ilya Sutskever', 'Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Apex'), 'David Kim', 'Fullstack Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Apex'), 'Priya Patel', 'UX Researcher'),
  ((SELECT id FROM teams WHERE name = 'Team Apex'), 'Sam Altman', 'Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Zenith'), 'Jordan Smyth', 'Growth Lead'),
  ((SELECT id FROM teams WHERE name = 'Team Zenith'), 'Leila Vance', 'Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Zenith'), 'Mira Murati', 'Designer'),
  ((SELECT id FROM teams WHERE name = 'Team Beacon'), 'Riley Cooper', 'Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Beacon'), 'Jordan Lee', 'Designer'),
  ((SELECT id FROM teams WHERE name = 'Team Cascade'), 'Morgan Chase', 'Engineer'),
  ((SELECT id FROM teams WHERE name = 'Team Cascade'), 'Taylor Reed', 'Designer'),
  ((SELECT id FROM teams WHERE name = 'Team Vortex'), 'Casey Quinn', 'Engineer')
ON CONFLICT DO NOTHING;