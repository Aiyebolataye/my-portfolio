"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-4 sm:top-4">
      <div
        className={`mx-auto max-w-6xl rounded-2xl border border-line bg-surface/80 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_40px_-24px_rgba(0,0,0,0.35)]" : ""
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-4">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg pr-2"
            aria-label="Aiyebola Taye — home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-mono text-[11px] font-medium tracking-tight text-canvas">
              AT
            </span>
            <span className="hidden text-[13px] font-medium tracking-tight sm:block">
              Aiyebola Taye
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer rounded-full px-3 py-1.5 text-[13px] text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/#contact"
              className="hidden cursor-pointer rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-canvas transition-opacity duration-200 hover:opacity-85 sm:block"
            >
              Start a conversation
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-ink md:hidden"
            >
              {open ? (
                <X className="h-4 w-4" strokeWidth={1.8} />
              ) : (
                <Menu className="h-4 w-4" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-line px-3 pb-3 pt-2 md:hidden">
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="mt-2 cursor-pointer rounded-lg bg-ink px-3 py-2.5 text-center text-sm font-medium text-canvas"
              >
                Start a conversation
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
