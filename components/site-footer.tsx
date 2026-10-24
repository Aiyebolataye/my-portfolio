import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Profile } from "@/lib/types";

const currentYear = new Date().getFullYear();

export function SiteFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl tracking-tight">Let&apos;s build something useful.</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            {profile.email}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
          {profile.github_url ? (
            <Link
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer transition-colors hover:text-ink"
            >
              GitHub
            </Link>
          ) : null}
          {profile.linkedin_url ? (
            <Link
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer transition-colors hover:text-ink"
            >
              LinkedIn
            </Link>
          ) : null}
          <Link href="/#work" className="cursor-pointer transition-colors hover:text-ink">
            Work
          </Link>
          <Link href="/login" className="cursor-pointer transition-colors hover:text-ink">
            Admin
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-line px-5 py-5 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          © {currentYear} {profile.full_name} · Built with Next.js and Supabase
        </p>
      </div>
    </footer>
  );
}
