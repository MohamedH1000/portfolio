-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
CREATE POLICY "Public read projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read experiences" ON experiences
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Contacts: anyone can insert, only authenticated can read
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated read contacts" ON contacts
  FOR SELECT TO authenticated USING (true);

-- Authenticated full access for admin (via Supabase Dashboard)
CREATE POLICY "Admin manage projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage testimonials" ON testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage experiences" ON experiences
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage site_settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage contacts" ON contacts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin delete contacts" ON contacts
  FOR DELETE TO authenticated USING (true);
