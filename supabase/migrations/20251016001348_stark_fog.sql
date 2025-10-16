/*
  # Create posts table for blog

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author` (text, default 'Anonymous')
      - `is_verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `posts` table
    - Add policy for anyone to read posts
    - Add policy for anyone to insert/update/delete posts (since it's a personal blog)
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text DEFAULT 'Anonymous',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert posts
CREATE POLICY "Anyone can insert posts"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update posts
CREATE POLICY "Anyone can update posts"
  ON posts
  FOR UPDATE
  TO public
  USING (true);

-- Allow anyone to delete posts
CREATE POLICY "Anyone can delete posts"
  ON posts
  FOR DELETE
  TO public
  USING (true);