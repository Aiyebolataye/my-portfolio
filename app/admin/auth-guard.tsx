'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
      if (!u) {
        router.replace("/login?next=/admin");
      }
    });
    return () => unsub();
  }, [router]);

  if (!ready) return null;
  if (!user) return null;
  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin" className="inline-flex items-center rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] hover:bg-surface-2">Admin</Link>
            <Link href="/admin/projects" className="inline-flex items-center rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:bg-surface-2 hover:text-ink">Projects</Link>
            <Link href="/admin/experience" className="inline-flex items-center rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:bg-surface-2 hover:text-ink">Experience</Link>
            <Link href="/admin/profile" className="inline-flex items-center rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:bg-surface-2 hover:text-ink">Profile</Link>
            <Link href="/admin/messages" className="inline-flex items-center rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:bg-surface-2 hover:text-ink">Messages</Link>
            <Link href="/" className="inline-flex items-center rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:bg-surface-2 hover:text-ink">View site</Link>
          </div>
          <button onClick={() => signOut(auth)} className="inline-flex items-center rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:bg-surface-2 hover:text-ink">Sign out</button>
        </div>
      </div>
      {children}
    </div>
  );
}
