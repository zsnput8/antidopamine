/*
  # Add post type to posts table

  ## Changes
  
  1. **Add post_type column**
     - `post_type` (text, default 'public') - Type of post: 'admin_only' or 'public'
     - Admin posts can only be created by authenticated users
     - Public posts can be created by anyone
  
  2. **Update RLS Policies**
     - Update insert policy to check post_type restrictions
     - Only authenticated users can create admin_only posts
     - Anyone can create public posts

  ## Important Notes
  
  - All existing posts will be set to 'public' by default
  - This allows separation between admin announcements and public posts
*/

-- Add post_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'post_type'
  ) THEN
    ALTER TABLE posts ADD COLUMN post_type text DEFAULT 'public' CHECK (post_type IN ('admin_only', 'public'));
  END IF;
END $$;

-- Drop existing insert policy
DROP POLICY IF EXISTS "Anyone can create posts" ON posts;

-- Create new insert policies
CREATE POLICY "Anyone can create public posts"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (post_type = 'public');

CREATE POLICY "Only admins can create admin posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (post_type = 'admin_only');

-- Update existing posts to be public
UPDATE posts SET post_type = 'public' WHERE post_type IS NULL;
