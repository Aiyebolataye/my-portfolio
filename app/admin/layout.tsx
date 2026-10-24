import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { hasSupabaseEnv } from "@/lib/config";
import { signOut } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let email: string | null = null;
  let unread = 0;

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login?next=/admin");
    email = user.email ?? null;

    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("read", false);
    unread = count ?? 0;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 md:grid md:grid-cols-[230px_1fr] md:gap-10 md:py-8">
        <aside className="md:sticky md:top-8 md:h-[calc(100vh-4rem)] md:self-start">
          <div className="flex items-center justify-between md:block">
            <Link
              href="/admin"
              className="flex cursor-pointer items-center gap-2.5"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-mono text-[11px] font-medium text-canvas">
                AT
              </span>
              <span className="text-[13px] font-medium tracking-tight">
                Studio
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-[11.5px] text-muted transition-colors hover:text-ink md:hidden"
            >
              View site
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
            </Link>
          </div>

          <div className="mt-4 md:mt-8">
            <AdminNav unread={unread} />
          </div>

          <div className="mt-6 hidden border-t border-line pt-4 md:block">
            <Link
              href="/"
              target="_blank"
              className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-ink"
            >
              View public site
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </Link>

            <div className="mt-4">
              <p className="truncate font-mono text-[10.5px] text-muted">
                {email ?? "local demo"}
              </p>
              <form action={signOut}>
                <button
                  type="submit"
                  className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-ink"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
}
