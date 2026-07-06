import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();
  const [{ count: projectCount }, { count: articleCount }, { count: draftCount }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  const cards = [
    { label: "Projects", value: projectCount ?? 0, href: "/admin/projects" },
    { label: "Articles", value: articleCount ?? 0, href: "/admin/articles" },
    { label: "Draft projects", value: draftCount ?? 0, href: "/admin/projects" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white border hairline p-6 hover:border-ink transition-colors">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">{c.label}</p>
            <p className="font-display text-4xl">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="flex gap-4">
        <Link href="/admin/projects/new" className="font-mono text-xs uppercase tracking-widest bg-ink text-paper px-4 py-3">
          + New project
        </Link>
        <Link href="/admin/articles/new" className="font-mono text-xs uppercase tracking-widest border border-ink px-4 py-3">
          + New article
        </Link>
        <Link href="/admin/theme" className="font-mono text-xs uppercase tracking-widest border border-ink px-4 py-3">
          Edit theme & site info
        </Link>
      </div>
    </div>
  );
}
