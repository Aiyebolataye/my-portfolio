"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage can be unavailable in private modes.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-ink/30 hover:text-ink"
    >
      <Moon className="h-[18px] w-[18px] dark:hidden" strokeWidth={1.6} />
      <Sun className="hidden h-[18px] w-[18px] dark:block" strokeWidth={1.6} />
    </button>
  );
}
