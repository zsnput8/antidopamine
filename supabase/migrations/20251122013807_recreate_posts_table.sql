/*
  # Recreate posts table with all historical data

  1. New Tables
    - `posts` table with all fields including security tracking
  
  2. Security
    - Enable RLS
    - Add policies for public and admin posts

  3. Data
    - Recreate with support for existing posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  is_verified boolean DEFAULT false,
  post_type text DEFAULT 'public',
  created_by text,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public posts"
  ON posts
  FOR SELECT
  TO public
  USING (post_type = 'public');

CREATE POLICY "Allow public post creation"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (post_type = 'public');

CREATE POLICY "Allow admin post creation"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (post_type = 'admin_only' AND is_verified = true);

CREATE POLICY "Allow post updates"
  ON posts
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow post deletion"
  ON posts
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS posts_post_type_created_at_idx ON posts(post_type, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_created_by_idx ON posts(created_by);

INSERT INTO posts (id, title, content, author, is_verified, post_type, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Welcome to Our Platform', 'This is a place to share your thoughts and reflections. Every voice matters here. Feel free to express yourself authentically and connect with others in meaningful ways.', 'Admin', true, 'public', '2024-10-16 00:00:00+00', '2024-10-16 00:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'The Art of Self-Reflection', 'Self-reflection is the gateway to self-awareness. When we take time to examine our thoughts, feelings, and actions, we gain valuable insights into who we are and who we want to become. It is through this introspective journey that we discover our true potential.', 'Sarah', false, 'public', '2024-10-17 12:30:00+00', '2024-10-17 12:30:00+00'),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Finding Peace in Chaos', 'In a world that never stops moving, finding moments of peace becomes essential. Whether through meditation, journaling, or simply being present, we can cultivate inner calm amidst external chaos.', 'Marcus', false, 'public', '2024-10-18 08:15:00+00', '2024-10-18 08:15:00+00'),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Growth Through Challenge', 'Every challenge we face is an opportunity for growth. Our struggles shape us, strengthen us, and ultimately define our character. Embrace the difficulties, learn from them, and emerge stronger.', 'Elena', false, 'public', '2024-10-19 14:45:00+00', '2024-10-19 14:45:00+00'),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'The Power of Gratitude', 'Gratitude transforms our perspective. When we acknowledge the good in our lives, no matter how small, we shift our focus from what we lack to what we have. This simple practice can profoundly impact our happiness and well-being.', 'James', true, 'public', '2024-10-20 10:00:00+00', '2024-10-20 10:00:00+00');
