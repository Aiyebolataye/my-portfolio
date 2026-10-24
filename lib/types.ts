export type Profile = {
  id: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  availability: string | null;
  updated_at: string | null;
};

export type ProjectStatus = "live" | "in-development" | "archived";

export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  tech_stack: string[] | null;
  live_url: string | null;
  repo_url: string | null;
  cover_image_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
};

export type ProjectMedia = {
  id: string;
  project_id: string;
  type: "image" | "video";
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string | null;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string | null;
  sort_order: number;
  created_at: string | null;
};

export type Skill = {
  id: string;
  category: string;
  name: string;
  sort_order: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string | null;
};

export type PageView = {
  id: number;
  path: string;
  referrer: string | null;
  created_at: string | null;
};
