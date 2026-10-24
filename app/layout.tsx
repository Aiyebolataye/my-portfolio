import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { siteUrl } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aiyebola Taye — Full-Stack Engineer",
    template: "%s — Aiyebola Taye",
  },
  description:
    "Full-stack engineer in Abuja, Nigeria. I build production web and mobile products with Next.js, TypeScript, PostgreSQL, and Flutter.",
  keywords: [
    "Aiyebola Taye",
    "full-stack engineer",
    "backend engineer",
    "Nigeria developer",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Flutter",
  ],
  authors: [{ name: "Aiyebola Taye", url: "https://github.com/Aiyebolataye" }],
  openGraph: {
    title: "Aiyebola Taye — Full-Stack Engineer",
    description:
      "I build production web and mobile products with Next.js, TypeScript, PostgreSQL, and Flutter.",
    url: siteUrl,
    siteName: "Aiyebola Taye",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aiyebola Taye — Full-Stack Engineer",
    description:
      "I build production web and mobile products with Next.js, TypeScript, PostgreSQL, and Flutter.",
  },
  robots: { index: true, follow: true },
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored ? stored === "dark" : prefersDark;
    if (dark) document.documentElement.classList.add("dark");
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
