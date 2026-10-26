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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-mono text-[10.5px] uppercase tracking-[0.18em]">Admin</Link>
            <Link href="/" className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">View site</Link>
          </div>
          <button onClick={() => signOut(auth)} className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted hover:text-ink">Sign out</button>
        </div>
      </div>
      {children}
    </div>
  );
}
