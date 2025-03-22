/*
  # Create Skills Marketplace Schema

  1. New Tables
    - `skills`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `rating` (numeric)
      - `category` (text)
      - `student_name` (text)
      - `student_image` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `skills` table
    - Add policies for:
      - Anyone can view skills
      - Authenticated users can create skills
      - Users can only update/delete their own skills
*/

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  rating numeric NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  category text NOT NULL,
  student_name text NOT NULL,
  student_image text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read skills
CREATE POLICY "Anyone can view skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create skills
CREATE POLICY "Authenticated users can create skills"
  ON skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own skills
CREATE POLICY "Users can update own skills"
  ON skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own skills
CREATE POLICY "Users can delete own skills"
  ON skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);