"use client";

import Link from "next/link";
import { useSiteSettings } from "./ThemeProvider";

export default function Nav() {
  const settings = useSiteSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 mix-blend-difference text-paper">
      <Link href="/" className="font-display text-lg tracking-tight">
        {settings.site_name}
      </Link>
      <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
        <Link href="/projects" className="hover:opacity-60 transition-opacity">
          Work
        </Link>
        <Link href="/articles" className="hover:opacity-60 transition-opacity">
          Log
        </Link>
        <Link href="/about" className="hover:opacity-60 transition-opacity">
          About
        </Link>
        <Link href="/contact" className="hover:opacity-60 transition-opacity">
          Contact
        </Link>
      </nav>
      <Link
        href="/contact"
        className="font-mono text-xs uppercase tracking-widest border border-current px-3 py-1.5 hover:opacity-60 transition-opacity"
      >
        Start a project →
      </Link>
    </header>
  );
}
