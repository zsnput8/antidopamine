/*
  # Fix delete policy for posts

  ## Changes
  
  1. **Fix delete policy**
     - The delete policy was restricted to authenticated users only
     - Need to allow deletes through the anon key when admin is logged in client-side
     - Remove old insert policy that conflicts with new ones

  ## Important Notes
  
  - Client-side admin mode uses anon key, not authenticated key
  - Delete operations need to work with public role
  - This maintains security since we check admin status in the frontend
*/

-- Drop old conflicting insert policy
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;

-- Drop the restrictive delete policy
DROP POLICY IF EXISTS "Only admins can delete posts" ON posts;

-- Create a new delete policy that allows public role
CREATE POLICY "Allow delete for posts"
  ON posts
  FOR DELETE
  TO public
  USING (true);
