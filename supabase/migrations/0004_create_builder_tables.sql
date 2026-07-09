-- Builder content tables (Journey, Passport, Log)

-- Create journey_days table
CREATE TABLE IF NOT EXISTS journey_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE journey_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read journey_days" ON journey_days FOR SELECT USING (true);
CREATE POLICY "Auth insert journey_days" ON journey_days FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update journey_days" ON journey_days FOR UPDATE TO authenticated USING (true);

-- Create journey_tasks table
CREATE TABLE IF NOT EXISTS journey_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_day_id UUID NOT NULL REFERENCES journey_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE journey_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read journey_tasks" ON journey_tasks FOR SELECT USING (true);
CREATE POLICY "Auth insert journey_tasks" ON journey_tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update journey_tasks" ON journey_tasks FOR UPDATE TO authenticated USING (true);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'current', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read milestones" ON milestones FOR SELECT USING (true);
CREATE POLICY "Auth insert milestones" ON milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update milestones" ON milestones FOR UPDATE TO authenticated USING (true);

-- Create activity_log table (Builder Log)
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read activity_log" ON activity_log FOR SELECT USING (true);
CREATE POLICY "Auth insert activity_log" ON activity_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update activity_log" ON activity_log FOR UPDATE TO authenticated USING (true);

-- Seed journey days + tasks
INSERT INTO journey_days (day_number, title) VALUES
  (1, 'Orientation & Problem Framing'),
  (2, 'User Research & Validation'),
  (3, 'Solution Architecture'),
  (4, 'Sprint Planning & Setup'),
  (5, 'Core Build — Frontend'),
  (6, 'Core Build — Backend'),
  (7, 'Integration & QA'),
  (8, 'User Testing & Feedback'),
  (9, 'Polish & Prep'),
  (10, 'Demo Day')
ON CONFLICT (day_number) DO NOTHING;

INSERT INTO journey_tasks (journey_day_id, name, done) 
SELECT jd.id, t.name, t.done
FROM (VALUES
  (1, 'Team formation & introductions', true),
  (1, 'Problem statement workshop', true),
  (1, 'Market sizing exercise', true),
  (2, 'Conduct 5 user interviews', true),
  (2, 'Synthesize findings', true),
  (2, 'Define target persona', true),
  (3, 'Wireframe key screens', true),
  (3, 'Design data model', true),
  (3, 'Choose tech stack', true),
  (4, 'Set up repo & CI/CD', true),
  (4, 'Create sprint backlog', true),
  (4, 'Set up dev environment', false),
  (5, 'Build landing page', false),
  (5, 'Implement auth UI', false),
  (5, 'Dashboard layout', false),
  (6, 'API endpoints', false),
  (6, 'Database schema', false),
  (6, 'Integration tests', false),
  (7, 'Frontend-backend integration', false),
  (7, 'Bug bash', false),
  (7, 'Performance audit', false),
  (8, 'Ship to beta users', false),
  (8, 'Collect & triage feedback', false),
  (8, 'Prioritize fixes', false),
  (9, 'Visual polish', false),
  (9, 'Demo script', false),
  (9, 'Deploy to production', false),
  (10, 'Final walkthrough', false),
  (10, 'Live demo', false),
  (10, 'Celebration!', false)
) AS t(day_num, name, done)
JOIN journey_days jd ON jd.day_number = t.day_num
ON CONFLICT DO NOTHING;

-- Seed milestones
INSERT INTO milestones (day_number, title, status) VALUES
  (1, 'Problem Discovery', 'completed'),
  (2, 'Idea Validation', 'completed'),
  (3, 'Architecture & Design', 'completed'),
  (4, 'MVP Scoping', 'current'),
  (5, 'Core Build Phase 1', 'pending'),
  (6, 'Core Build Phase 2', 'pending'),
  (7, 'Integrations', 'pending'),
  (8, 'Soft Launch', 'pending'),
  (9, 'Polish & Testing', 'pending'),
  (10, 'Demo Day', 'pending')
ON CONFLICT (day_number) DO NOTHING;

-- Seed activity log
INSERT INTO activity_log (author, avatar, content, likes) VALUES
  ('Sarah Chen', 'SC', 'Just finished 5 user interviews — the pain point around project handoffs is much bigger than we thought.', 8),
  ('Alex Rivera', 'AR', 'Set up the monorepo with shared configs. Ready for the core build sprint!', 12),
  ('Marcus Thorne', 'MT', 'API design is finalized. Going with tRPC for type-safe endpoints.', 5),
  ('Elena Rodriguez', 'ER', 'Dashboard wireframes are looking 🔥. Moving to high-fidelity mockups.', 15),
  ('David Kim', 'DK', 'Deployed our first staging environment. CI/CD pipeline is green!', 9)
ON CONFLICT DO NOTHING;