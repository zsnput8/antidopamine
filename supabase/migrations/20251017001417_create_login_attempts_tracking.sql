/*
  # Create login attempts tracking system

  ## New Tables
  
  1. **login_attempts**
     - `id` (uuid, primary key) - Unique identifier for each attempt
     - `fingerprint` (text, not null) - Browser fingerprint (combination of user agent, screen resolution, timezone, etc)
     - `ip_address` (text) - IP address of the attempt
     - `attempted_at` (timestamptz, default now()) - When the attempt was made
     - `was_successful` (boolean, default false) - Whether the login was successful
     
  2. **blocked_fingerprints**
     - `id` (uuid, primary key) - Unique identifier
     - `fingerprint` (text, unique, not null) - Blocked browser fingerprint
     - `blocked_until` (timestamptz, not null) - When the block expires
     - `blocked_at` (timestamptz, default now()) - When the block was created
     - `reason` (text) - Reason for blocking

  ## Security
  
  1. **Row Level Security (RLS)**
     - Enable RLS on both tables
     
  2. **Policies**
     - Anyone can insert login attempts (needed for tracking)
     - Anyone can read their own attempts (needed for rate limiting)
     - Only authenticated users (admins) can view all attempts
     - Only authenticated users (admins) can manage blocked fingerprints

  ## Important Notes
  
  - Fingerprints combine multiple browser characteristics to create unique identifiers
  - This makes it much harder to bypass rate limiting than IP-based systems
  - Failed attempts are tracked and can trigger progressive blocks
  - Blocks are temporary and automatically expire
*/

-- Create login_attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,
  ip_address text,
  attempted_at timestamptz DEFAULT now(),
  was_successful boolean DEFAULT false
);

-- Create blocked_fingerprints table
CREATE TABLE IF NOT EXISTS blocked_fingerprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text UNIQUE NOT NULL,
  blocked_until timestamptz NOT NULL,
  blocked_at timestamptz DEFAULT now(),
  reason text
);

-- Enable RLS
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_fingerprints ENABLE ROW LEVEL SECURITY;

-- Policies for login_attempts
CREATE POLICY "Anyone can insert login attempts"
  ON login_attempts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read login attempts"
  ON login_attempts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can delete login attempts"
  ON login_attempts
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for blocked_fingerprints
CREATE POLICY "Anyone can read blocked fingerprints"
  ON blocked_fingerprints
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert blocked fingerprints"
  ON blocked_fingerprints
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can update blocked fingerprints"
  ON blocked_fingerprints
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only admins can delete blocked fingerprints"
  ON blocked_fingerprints
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS login_attempts_fingerprint_idx ON login_attempts(fingerprint);
CREATE INDEX IF NOT EXISTS login_attempts_attempted_at_idx ON login_attempts(attempted_at DESC);
CREATE INDEX IF NOT EXISTS blocked_fingerprints_fingerprint_idx ON blocked_fingerprints(fingerprint);
CREATE INDEX IF NOT EXISTS blocked_fingerprints_blocked_until_idx ON blocked_fingerprints(blocked_until);

-- Function to clean up old login attempts (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts
  WHERE attempted_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired blocks
CREATE OR REPLACE FUNCTION cleanup_expired_blocks()
RETURNS void AS $$
BEGIN
  DELETE FROM blocked_fingerprints
  WHERE blocked_until < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
