"use client";

import Link from "next/link";
import { useSiteSettings } from "./ThemeProvider";

export default function Footer() {
  const settings = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t hairline px-6 md:px-10 py-10 mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="font-display text-3xl md:text-4xl leading-tight max-w-md">
            Let&apos;s build something that looks as good as it thinks.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-4 font-mono text-xs uppercase tracking-widest border-b border-ink pb-0.5"
          >
            Start a conversation →
          </Link>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest space-y-2 text-muted">
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-ink transition-colors"
          >
            Instagram
          </a>
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="block hover:text-ink transition-colors">
              Email
            </a>
          )}
          <p className="pt-2 opacity-60">
            © {year} {settings.site_name}
          </p>
        </div>
      </div>
    </footer>
  );
}
