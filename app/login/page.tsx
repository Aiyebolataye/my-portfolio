import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back to site
        </Link>

        <div className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink font-mono text-[11px] font-medium text-canvas">
            AT
          </span>
          <h1 className="mt-5 font-display text-2xl tracking-tight">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Sign in with Firebase Auth
          </p>

          <div className="mt-6">
            <LoginForm next={next ?? "/admin"} />
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
          aiye bolataye@gmail.com
        </p>
      </div>
    </div>
  );
}
