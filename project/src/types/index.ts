export interface User {
  id: string;
  email: string;
  full_name: string;
  university: string;
  major: string;
  graduation_year: number;
  bio: string;
  avatar_url?: string;
}

export interface Skill {
  id: string;
  user_id: string;
  title: string;
  description: string;
  proficiency_level: string;
  created_at: string;
}