import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
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

    const supabase = await createClient();
    await supabase.from("page_views").insert({ path, referrer });
  } catch {
    // Tracking must never break the page.
  }

  return NextResponse.json({ ok: true });
}
