/*
  # Initial Schema Setup for Student Skill Marketplace

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth.users id
      - `email` (text, unique)
      - `full_name` (text)
      - `university` (text)
      - `major` (text)
      - `graduation_year` (integer)
      - `bio` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp with time zone)

    - `skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `title` (text)
      - `description` (text)
      - `proficiency_level` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own profile data
      - Update their own profile
      - Create and read skills
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  university text NOT NULL,
  major text NOT NULL,
  graduation_year integer NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  proficiency_level text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for skills table
CREATE POLICY "Users can read all skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own skills"
  ON skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);