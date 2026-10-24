import { hasSupabaseEnv } from "./config";
import {
  demoExperience,
  demoMessages,
  demoProfile,
  demoProjects,
  demoSkills,
} from "./demo-data";
import { createClient } from "./supabase/server";
import type {
  Experience,
  Message,
  Profile,
  Project,
  ProjectMedia,
  Skill,
} from "./types";

async function query<T>(
  run: (supabase: Awaited<ReturnType<typeof createClient>>) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!hasSupabaseEnv) return fallback;
  try {
    const supabase = await createClient();
    return await run(supabase);
  } catch {
    return fallback;
  }
}

export async function getProfile(): Promise<Profile> {
  return query(async (supabase) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as Profile | null) ?? demoProfile;
  }, demoProfile);
}

export async function getProjects(options?: {
  includeDrafts?: boolean;
}): Promise<Project[]> {
  return query(async (supabase) => {
    let request = supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!options?.includeDrafts) request = request.eq("published", true);
    const { data } = await request;
    return (data as Project[] | null) ?? demoProjects;
  }, demoProjects);
}

export async function getProject(slug: string): Promise<Project | null> {
  return query(async (supabase) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return (data as Project | null) ?? null;
  }, demoProjects.find((project) => project.slug === slug) ?? null);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return query(async (supabase) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return (data as Project | null) ?? null;
  }, demoProjects.find((project) => project.id === id) ?? null);
}

export async function getProjectMedia(
  projectId: string
): Promise<ProjectMedia[]> {
  return query(async (supabase) => {
    const { data } = await supabase
      .from("project_media")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    return (data as ProjectMedia[] | null) ?? [];
  }, []);
}

export async function getExperience(): Promise<Experience[]> {
  return query(async (supabase) => {
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as Experience[] | null) ?? demoExperience;
  }, demoExperience);
}

export async function getSkills(): Promise<Skill[]> {
  return query(async (supabase) => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    return (data as Skill[] | null) ?? demoSkills;
  }, demoSkills);
}

export async function getMessages(): Promise<Message[]> {
  return query(async (supabase) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    return (data as Message[] | null) ?? demoMessages;
  }, demoMessages);
}

export type DashboardStats = {
  totalViews: number;
  viewsLast7Days: number;
  unreadMessages: number;
  projectCount: number;
  publishedCount: number;
  viewsByDay: { day: string; views: number }[];
  topPages: { path: string; views: number }[];
};

const emptyStats: DashboardStats = {
  totalViews: 0,
  viewsLast7Days: 0,
  unreadMessages: 0,
  projectCount: demoProjects.length,
  publishedCount: demoProjects.filter((project) => project.published).length,
  viewsByDay: [],
  topPages: [],
};

export async function getDashboardStats(): Promise<DashboardStats> {
  return query(async (supabase) => {
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);

    const [total, recent, unread, projectCount, publishedCount, views] =
      await Promise.all([
        supabase.from("page_views").select("*", { count: "exact", head: true }),
        supabase
          .from("page_views")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 864e5).toISOString()),
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("read", false),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("published", true),
        supabase
          .from("page_views")
          .select("path, created_at")
          .gte("created_at", since.toISOString())
          .limit(5000),
      ]);

    const buckets = new Map<string, number>();
    for (let i = 13; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      buckets.set(date.toISOString().slice(0, 10), 0);
    }

    const pageCounts = new Map<string, number>();
    for (const row of views.data ?? []) {
      const day = String(row.created_at).slice(0, 10);
      if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
      const path = row.path ?? "/";
      pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1);
    }

    return {
      totalViews: total.count ?? 0,
      viewsLast7Days: recent.count ?? 0,
      unreadMessages: unread.count ?? 0,
      projectCount: projectCount.count ?? demoProjects.length,
      publishedCount: publishedCount.count ?? 0,
      viewsByDay: Array.from(buckets, ([day, count]) => ({
        day: day.slice(5),
        views: count,
      })),
      topPages: Array.from(pageCounts, ([path, count]) => ({
        path,
        views: count,
      }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
    };
  }, emptyStats);
}
