import { NextResponse } from "next/server";
import { hasFirebaseEnv } from "@/lib/config";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  if (!hasFirebaseEnv) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const body = (await request.json()) as {
      path?: unknown;
      referrer?: unknown;
    };

    const path =
      typeof body.path === "string" && body.path.length > 0
        ? body.path.slice(0, 300)
        : "/";
    const referrer =
      typeof body.referrer === "string" && body.referrer.length > 0
        ? body.referrer.slice(0, 500)
        : null;

    await adminDb.collection("page_views").add({ path, referrer, created_at: new Date().toISOString() });
  } catch {
    // Tracking must never break the page.
  }

  return NextResponse.json({ ok: true });
}
