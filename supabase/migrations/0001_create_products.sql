-- Create product_status enum
CREATE TYPE product_status AS ENUM ('draft', 'published');

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  team TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  github_url TEXT,
  demo_url TEXT,
  cover_image TEXT,
  status product_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all products
CREATE POLICY "Authenticated users can read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin users to insert products
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow admin users to update products
CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true);

-- Allow admin users to delete products
CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Seed data
INSERT INTO products (name, short_description, team, progress, github_url, demo_url, cover_image, status) VALUES
  ('StellarFlow', 'AI-powered workflow automation platform', 'Nebula', 92, 'https://github.com/teams/stellarflow', 'https://stellarflow.demo', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop', 'published'),
  ('QuarkDB', 'Real-time database for collaborative apps', 'Quantum', 78, 'https://github.com/teams/quarkdb', 'https://quarkdb.demo', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop', 'published'),
  ('LumeOS', 'Remote team wellness platform', 'Zenith', 85, 'https://github.com/teams/lumeos', 'https://lumeos.demo', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop', 'published'),
  ('FinLens', 'Personal finance analytics dashboard', 'Apex', 45, NULL, NULL, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', 'draft'),
  ('ReviewPilot', 'Automated code review assistant', 'Beacon', 60, 'https://github.com/teams/reviewpilot', NULL, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', 'draft'),
  ('WellSync', 'Cross-team scheduling tool', 'Cascade', 30, NULL, NULL, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop', 'draft');
