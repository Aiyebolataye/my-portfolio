import { hasFirebaseEnv } from "./config";
import { demoExperience, demoMessages, demoProfile, demoProjects, demoSkills } from "./demo-data";
import type { Experience, Message, Profile, Project, ProjectMedia, Skill } from "./types";
  demoExperience,
  demoMessages,
  demoProfile,
  demoProjects,
  demoSkills,
} from "./demo-data";
import type {
  Experience,
  Message,
  Profile,
  Project,
  ProjectMedia,
  Skill,
} from "./types";

async function query<T>(
  run: (db: any) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!hasFirebaseEnv) return fallback;
  try {
    const { adminDb } = await import("./firebase/admin");
    return await run(adminDb);
  } catch {
    return fallback;
  }
}

export async function getProfile(): Promise<Profile> {
  return query(async (db) => {
    const snapshot = await db
      .collection("profiles")
      .orderBy("updated_at", "desc")
      .limit(1)
      .get();
    if (snapshot.empty) return demoProfile;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Profile;
  }, demoProfile);
}

export async function getProjects(options?: {
  includeDrafts?: boolean;
}): Promise<Project[]> {
  return query(async (db) => {
    const collection = db.collection("projects");
    let snapshot;
    if (options?.includeDrafts) {
      snapshot = await collection.orderBy("sort_order", "asc").orderBy("created_at", "desc").get();
    } else {
      snapshot = await collection.where("published", "==", true).orderBy("sort_order", "asc").orderBy("created_at", "desc").get();
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
  }, demoProjects);
}

export async function getProject(slug: string): Promise<Project | null> {
  return query(async (db) => {
    const snapshot = await db
      .collection("projects")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Project;
  }, demoProjects.find((project) => project.slug === slug) ?? null);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return query(async (db) => {
    const snapshot = await db
      .collection("projects")
      .where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Project;
  }, demoProjects.find((project) => project.id === id) ?? null);
}

export async function getProjectMedia(
  projectId: string
): Promise<ProjectMedia[]> {
  return query(async (db) => {
    const snapshot = await db
      .collection("project_media")
      .where("project_id", "==", projectId)
      .orderBy("sort_order", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProjectMedia));
  }, []);
}

export async function getExperience(): Promise<Experience[]> {
  return query(async (db) => {
    const snapshot = await db
      .collection("experience")
      .orderBy("sort_order", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Experience));
  }, demoExperience);
}

export async function getSkills(): Promise<Skill[]> {
  return query(async (db) => {
    const snapshot = await db
      .collection("skills")
      .orderBy("category", "asc")
      .orderBy("sort_order", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Skill));
  }, demoSkills);
}

export async function getMessages(): Promise<Message[]> {
  return query(async (db) => {
    const snapshot = await db
      .collection("messages")
      .orderBy("created_at", "desc")
      .limit(100)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message));
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
  return query(async (db) => {
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);

    const [total, recent, unread, projectCount, publishedCount, views] =
      await Promise.all([
        db.collection("page_views").get().then(snapshot => snapshot.size),
        db
          .collection("page_views")
          .where("created_at", ">=", since.toISOString())
          .get()
          .then(snapshot => snapshot.size),
        db
          .collection("messages")
          .where("read", "==", false)
          .get()
          .then(snapshot => snapshot.size),
        db.collection("projects").get().then(snapshot => snapshot.size),
        db
          .collection("projects")
          .where("published", "==", true)
          .get()
          .then(snapshot => snapshot.size),
        db
          .collection("page_views")
          .where("created_at", ">=", since.toISOString())
          .get(),
      ]);

    const buckets = new Map<string, number>();
    for (let i = 13; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      buckets.set(date.toISOString().slice(0, 10), 0);
    }

    const pageCounts = new Map<string, number>();
    for (const doc of views.docs ?? []) {
      const data = doc.data();
      const day = String(data.created_at).slice(0, 10);
      if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
      const path = data.path ?? "/";
      pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1);
    }

    return {
      totalViews: total ?? 0,
      viewsLast7Days: recent ?? 0,
      unreadMessages: unread ?? 0,
      projectCount: projectCount ?? demoProjects.length,
      publishedCount: publishedCount ?? 0,
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
