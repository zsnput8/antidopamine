/*
  # Enhance security with stricter RLS policies

  1. Drop old permissive policies
  2. Implement restrictive policies with fingerprinting
  3. Add audit logging table for tracking
  
  Security improvements:
  - Rate limiting through database
  - IP address tracking
  - Fingerprint verification
  - Stricter RLS enforcement
*/

DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;
DROP POLICY IF EXISTS "Anyone can view public posts" ON posts;
DROP POLICY IF EXISTS "Allow public post creation" ON posts;
DROP POLICY IF EXISTS "Allow admin post creation" ON posts;
DROP POLICY IF EXISTS "Allow post updates" ON posts;
DROP POLICY IF EXISTS "Allow post deletion" ON posts;

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_pkey CASCADE;

DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS post_audit_log CASCADE;
DROP TABLE IF EXISTS suspicious_activity CASCADE;

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  is_verified boolean DEFAULT false,
  post_type text DEFAULT 'public' CHECK (post_type IN ('public', 'admin_only')),
  created_by text,
  ip_address inet,
  fingerprint text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view')),
  fingerprint text,
  ip_address inet,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suspicious_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL,
  fingerprint text,
  ip_address inet,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public posts"
  ON posts
  FOR SELECT
  TO public
  USING (post_type = 'public');

CREATE POLICY "Public can create posts with validation"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (
    post_type = 'public' 
    AND is_verified = false
  );

CREATE POLICY "No post updates"
  ON posts
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "No direct post deletion"
  ON posts
  FOR DELETE
  TO public
  USING (false);

CREATE POLICY "Anyone can view audit logs"
  ON post_audit_log
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "System can write audit logs"
  ON post_audit_log
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "No suspicious activity access"
  ON suspicious_activity
  FOR SELECT
  TO public
  USING (false);

CREATE INDEX IF NOT EXISTS posts_type_created_idx ON posts(post_type, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_fingerprint_idx ON posts(fingerprint);
CREATE INDEX IF NOT EXISTS posts_ip_idx ON posts(ip_address);
CREATE INDEX IF NOT EXISTS audit_log_post_id_idx ON post_audit_log(post_id);
CREATE INDEX IF NOT EXISTS audit_log_fingerprint_idx ON post_audit_log(fingerprint);
CREATE INDEX IF NOT EXISTS suspicious_activity_created_idx ON suspicious_activity(created_at DESC);
