-- Storage bucket policies for Prod[X]
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('journey-images', 'journey-images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Auth insert avatars" ON storage.objects;
CREATE POLICY "Auth insert avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Auth update avatars" ON storage.objects;
CREATE POLICY "Auth update avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Public read resumes" ON storage.objects;
CREATE POLICY "Public read resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
DROP POLICY IF EXISTS "Auth insert resumes" ON storage.objects;
CREATE POLICY "Auth insert resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');
DROP POLICY IF EXISTS "Auth update resumes" ON storage.objects;
CREATE POLICY "Auth update resumes" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Public read journey-images" ON storage.objects;
CREATE POLICY "Public read journey-images" ON storage.objects FOR SELECT USING (bucket_id = 'journey-images');
DROP POLICY IF EXISTS "Auth insert journey-images" ON storage.objects;
CREATE POLICY "Auth insert journey-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'journey-images');
DROP POLICY IF EXISTS "Auth update journey-images" ON storage.objects;
CREATE POLICY "Auth update journey-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'journey-images' AND auth.uid() = owner);