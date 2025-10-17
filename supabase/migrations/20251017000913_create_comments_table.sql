/*
  # Create comments table for posts

  ## New Tables
  
  1. **comments**
     - `id` (uuid, primary key) - Unique identifier for each comment
     - `post_id` (uuid, foreign key) - References the post this comment belongs to
     - `author` (text, default 'Anonymous') - Name of the comment author
     - `content` (text, not null) - The comment text content
     - `created_at` (timestamptz, default now()) - When the comment was created
     - `updated_at` (timestamptz, default now()) - When the comment was last updated

  ## Security
  
  1. **Row Level Security (RLS)**
     - Enable RLS on comments table
     
  2. **Policies**
     - Anyone can read comments (public access for viewing)
     - Anyone can insert comments (public access for posting)
     - Only authenticated users (admins) can update comments
     - Only authenticated users (admins) can delete comments

  ## Important Notes
  
  - Comments are linked to posts via foreign key with CASCADE delete
  - When a post is deleted, all its comments are automatically deleted
  - Public can read and add comments, but only admins can modify/delete them
*/

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author text DEFAULT 'Anonymous',
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert comments
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users (admins) can update comments
CREATE POLICY "Only admins can update comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users (admins) can delete comments
CREATE POLICY "Only admins can delete comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);
