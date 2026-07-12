-- Enhanced Builder Passport tables
-- Add personal info columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- Builder skills table
CREATE TABLE IF NOT EXISTS builder_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  proficiency TEXT NOT NULL DEFAULT 'beginner' CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE builder_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read builder_skills" ON builder_skills FOR SELECT USING (true);
CREATE POLICY "Auth manage builder_skills" ON builder_skills FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL DEFAULT '🏆',
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Auth manage achievements" ON achievements FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Auth manage certificates" ON certificates FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- Seed achievements for existing profiles
INSERT INTO achievements (profile_id, badge_name, badge_icon, description)
SELECT p.id, 'Early Adopter', '🚀', 'One of the first builders to join Prod[X]'
FROM profiles p
ON CONFLICT DO NOTHING;

INSERT INTO achievements (profile_id, badge_name, badge_icon, description)
SELECT p.id, 'Problem Solver', '💡', 'Completed problem discovery phase'
FROM profiles p
ON CONFLICT DO NOTHING;

INSERT INTO achievements (profile_id, badge_name, badge_icon, description)
SELECT p.id, 'Ship Ready', '🎯', 'Launched a product to production'
FROM profiles p
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';