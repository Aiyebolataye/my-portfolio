"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasFirebaseEnv } from "./config";
import type { ProjectStatus } from "./types";

export type ActionState = {
  ok: boolean;
  message?: string;
};

const initialError: ActionState = {
  ok: false,
  message: "Something went wrong. Please try again.",
};

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function nullable(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/experience");
  revalidatePath("/admin/profile");
  revalidatePath("/admin/messages");
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function signIn(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!hasFirebaseEnv) {
    return {
      ok: false,
      message:
        "Firebase is not configured yet. Add your keys to .env.local and restart the dev server.",
    };
  }

  const email = text(formData, "email");
  const password = text(formData, "password");
  const next = text(formData, "next") || "/admin";

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  try {
    const { adminAuth } = await import("./firebase/admin");
    const userRecord = await adminAuth.getUserByEmail(email);
    if (!userRecord.emailVerified) {
      return { ok: false, message: "Please verify your email address." };
    }
    redirect(next.startsWith("/") ? next : "/admin");
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return { ok: false, message: "Invalid email or password." };
    }
    return { ok: false, message: "Authentication failed." };
  }
}

export async function signOut(): Promise<void> {
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Public contact form
// ---------------------------------------------------------------------------

export async function sendMessage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = text(formData, "name");
  const email = text(formData, "email");
  const message = text(formData, "message");
  const trap = text(formData, "company_website");

  if (trap) {
    return { ok: true, message: "Thanks! Your message is on its way." };
  }

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email, and message." };
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "That email address does not look right." };
  }

  if (!hasFirebaseEnv) {
    return {
      ok: true,
      message:
        "Demo mode: this form is not connected to a database yet. Add Firebase keys to receive messages.",
    };
  }

  const docId = crypto.randomUUID();
  try {
    const { adminDb } = await import("./firebase/admin");
    await adminDb
      .collection("messages")
      .add({ id: docId, name, email, message, created_at: new Date().toISOString(), read: false });

    revalidatePath("/admin/messages");
    return { ok: true, message: "Thanks! Your message is on its way." };
  } catch (error) {
    console.error("sendMessage error", error);
    return { ok: true, message: "Thanks! Your message is on its way." };
  }
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function saveProject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!hasFirebaseEnv) {
    return { ok: false, message: "Connect Firebase before saving projects." };
  }

  const id = text(formData, "id");
  const title = text(formData, "title");
  if (!title) return { ok: false, message: "A project needs a title." };

  const slug = slugify(text(formData, "slug") || title);
  const techStack = text(formData, "tech_stack")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const status = text(formData, "status") as ProjectStatus;
  const payload = {
    slug,
    title,
    tagline: nullable(formData, "tagline"),
    description: nullable(formData, "description"),
    tech_stack: techStack,
    live_url: nullable(formData, "live_url"),
    repo_url: nullable(formData, "repo_url"),
    cover_image_url: nullable(formData, "cover_image_url"),
    status: ["live", "in-development", "archived"].includes(status)
      ? status
      : "live",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: Number(text(formData, "sort_order") || 0),
    created_at: new Date().toISOString(),
  };

  try {
    const { adminDb } = await import("./firebase/admin");
    if (id) {
      await adminDb.collection("projects").doc(id).set(payload, { merge: true });
    } else {
      const docRef = await adminDb.collection("projects").add(payload);
      try {
        await docRef.update({ id: docRef.id });
      } catch {}
    }
    revalidateAll();
    try {
      revalidatePath(`/projects/${slug}`);
    } catch {}
    redirect("/admin/projects?saved=1");
  } catch (error) {
    console.error("saveProject error", error);
    return initialError;
  }
}

export async function deleteProject(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) redirect("/admin/projects");
  const id = text(formData, "id");
  if (id) {
    const { adminDb } = await import("./firebase/admin");
    await adminDb.collection("projects").doc(id).delete();
  }
  revalidateAll();
  redirect("/admin/projects?deleted=1");
}

export async function addProjectMedia(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) return;
  const projectId = text(formData, "project_id");
  const url = text(formData, "url");
  if (!projectId || !url) return;

  const { adminDb } = await import("./firebase/admin");
  await adminDb.collection("project_media").add({
    project_id: projectId,
    type: text(formData, "type") === "video" ? "video" : "image",
    url,
    caption: nullable(formData, "caption"),
    sort_order: Number(text(formData, "sort_order") || 0),
    created_at: new Date().toISOString(),
  });

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin/projects");
}

export async function deleteProjectMedia(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) return;
  const id = text(formData, "id");
  const projectId = text(formData, "project_id");
  if (!id) return;

  const { adminDb } = await import("./firebase/admin");
  await adminDb.collection("project_media").doc(id).delete();

  revalidatePath(`/admin/projects/${projectId}`);
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export async function saveExperience(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!hasFirebaseEnv) {
    return { ok: false, message: "Connect Firebase before saving experience." };
  }

  const id = text(formData, "id");
  const company = text(formData, "company");
  const role = text(formData, "role");
  const startDate = text(formData, "start_date");

  if (!company || !role || !startDate) {
    return {
      ok: false,
      message: "Company, role, and start date are required.",
    };
  }

  const current = formData.get("current") === "on";
  const payload = {
    company,
    role,
    location: nullable(formData, "location"),
    start_date: startDate,
    end_date: current ? null : nullable(formData, "end_date"),
    current,
    description: nullable(formData, "description"),
    sort_order: Number(text(formData, "sort_order") || 0),
    created_at: new Date().toISOString(),
  };

  try {
    const { adminDb } = await import("./firebase/admin");
    if (id) {
      await adminDb.collection("experience").doc(id).set(payload, { merge: true });
    } else {
      const docRef = await adminDb.collection("experience").add(payload);
      try {
        await docRef.update({ id: docRef.id });
      } catch {}
    }

    revalidateAll();
    redirect("/admin/experience?saved=1");
  } catch (error) {
    console.error("saveExperience error", error);
    return initialError;
  }
}

export async function deleteExperience(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) redirect("/admin/experience");
  const id = text(formData, "id");
  if (id) {
    const { adminDb } = await import("./firebase/admin");
    await adminDb.collection("experience").doc(id).delete();
  }
  revalidateAll();
  redirect("/admin/experience?deleted=1");
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!hasFirebaseEnv) {
    return { ok: false, message: "Connect Firebase before saving your profile." };
  }

  const id = text(formData, "id");
  const fullName = text(formData, "full_name");
  if (!fullName) return { ok: false, message: "Your name is required." };

  const payload = {
    full_name: fullName,
    headline: nullable(formData, "headline"),
    bio: nullable(formData, "bio"),
    location: nullable(formData, "location"),
    email: nullable(formData, "email"),
    phone: nullable(formData, "phone"),
    avatar_url: nullable(formData, "avatar_url"),
    resume_url: nullable(formData, "resume_url"),
    github_url: nullable(formData, "github_url"),
    linkedin_url: nullable(formData, "linkedin_url"),
    twitter_url: nullable(formData, "twitter_url"),
    availability: nullable(formData, "availability"),
    updated_at: new Date().toISOString(),
  };

  try {
    const { adminDb } = await import("./firebase/admin");
    if (id) {
      await adminDb.collection("profiles").doc(id).set(payload, { merge: true });
    } else {
      const docRef = await adminDb.collection("profiles").add(payload);
      try {
        await docRef.update({ id: docRef.id });
      } catch {}
    }

    revalidateAll();
    return { ok: true, message: "Profile saved." };
  } catch (error) {
    console.error("updateProfile error", error);
    return initialError;
  }
}

export async function addSkill(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) return;
  const name = text(formData, "name");
  const category = text(formData, "category") || "Other";
  if (!name) return;

  const { adminDb } = await import("./firebase/admin");
  await adminDb.collection("skills").add({
    name,
    category,
    sort_order: 0,
    created_at: new Date().toISOString(),
  });
  revalidateAll();
  redirect("/admin/profile?skills=saved");
}

export async function deleteSkill(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) return;
  const id = text(formData, "id");
  if (!id) return;

  const { adminDb } = await import("./firebase/admin");
  await adminDb.collection("skills").doc(id).delete();
  revalidateAll();
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function toggleMessageRead(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) return;
  const id = text(formData, "id");
  const read = text(formData, "read") === "true";
  if (!id) return;

  const { adminDb } = await import("./firebase/admin");
  await adminDb.collection("messages").doc(id).update({ read: !read });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  if (!hasFirebaseEnv) return;
  const id = text(formData, "id");
  if (!id) return;

  const { adminDb } = await import("./firebase/admin");
  await adminDb.collection("messages").doc(id).delete();
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
