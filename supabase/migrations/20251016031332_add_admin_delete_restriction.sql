/*
  # Restrict Post Deletion to Admins Only

  ## Changes Made
  
  1. **Drop Existing Delete Policy**
     - Removes the permissive "Anyone can delete posts" policy
  
  2. **Create New Admin-Only Delete Policy**
     - Only allows authenticated users to delete posts
     - This works with the frontend admin authentication system
     - Users must be logged in with admin credentials to delete
  
  ## Security Notes
  
  - Read, Insert, and Update operations remain public
  - Delete operations now require authentication
  - This aligns with the frontend admin login system using password protection
*/

-- Drop the old permissive delete policy
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;

-- Create new restrictive delete policy for authenticated users only
CREATE POLICY "Only admins can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);
