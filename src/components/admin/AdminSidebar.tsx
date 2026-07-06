"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/theme", label: "Theme & Site" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 bg-[#1a1a1c] text-[#eae7e0] min-h-screen flex flex-col justify-between py-8 px-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-8">Admin panel</p>
        <nav className="space-y-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "block px-3 py-2 rounded text-sm font-mono transition-colors",
                  active ? "bg-[#2454FF] text-white" : "hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="space-y-3">
        <Link href="/" target="_blank" className="block font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100">
          View live site ↗
        </Link>
        <button
          onClick={handleSignOut}
          className="font-mono text-xs uppercase tracking-widest opacity-60 hover:opacity-100"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
