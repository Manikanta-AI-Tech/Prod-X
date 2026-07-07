-- Product Management Module
-- Ensures products table exists with all needed columns for admin CRUD

-- Create product_status enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('idea', 'building', 'testing', 'live');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_description TEXT,
  team TEXT,
  status product_status NOT NULL DEFAULT 'idea',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  github_url TEXT,
  demo_url TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Safely create policies (drop first to handle re-runs)
DROP POLICY IF EXISTS "Authenticated users can read products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

CREATE POLICY "Authenticated users can read products" ON products
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() IS NULL);

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE TO authenticated USING (true);

-- Seed sample products (use INSERT OR IGNORE to be idempotent)
INSERT INTO products (name, short_description, team, status, progress, github_url, demo_url) VALUES
  ('StellarFlow', 'AI-powered workflow automation for distributed teams. Automate repetitive tasks and focus on what matters.', 'Team Alpha', 'live', 92, 'https://github.com/teams/stellarflow', 'https://stellarflow.demo'),
  ('QuarkDB', 'Real-time collaborative database for edge applications. Built for speed, designed for scale.', 'Team Beta', 'live', 78, 'https://github.com/teams/quarkdb', 'https://quarkdb.demo'),
  ('LumeOS', 'Open-source operating system for IoT devices. Lightweight, secure, and developer-friendly.', 'Team Gamma', 'live', 85, 'https://github.com/teams/lumeos', 'https://lumeos.demo'),
  ('FinLens', 'Financial analytics dashboard for startups. Track burn rate, runway, and revenue in real-time.', 'Team Delta', 'building', 45, 'https://github.com/teams/finlens', NULL),
  ('ReviewPilot', 'Automated code review assistant powered by LLMs. Catch bugs before they ship.', 'Team Epsilon', 'building', 60, 'https://github.com/teams/reviewpilot', NULL),
  ('WellSync', 'Wellness platform connecting employees with mental health professionals. Privacy-first design.', 'Team Zeta', 'idea', 30, NULL, NULL)
ON CONFLICT DO NOTHING;