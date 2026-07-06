import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/lib/types";

export const metadata = { title: "Work — Aswin T." };

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  const projects = (data as Project[]) ?? [];

  return (
    <div className="px-6 md:px-10 pt-32 pb-24 max-w-5xl mx-auto">
      <h1 className="font-display text-5xl md:text-7xl mb-16">Work</h1>
      <div className="divide-y hairline border-t hairline">
        {projects.map((p, i) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="group flex items-center gap-6 py-7 hover:bg-ink hover:text-paper transition-colors px-2 -mx-2"
          >
            <span className="font-mono text-xs text-muted group-hover:text-paper/60 w-8 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-2xl md:text-4xl flex-1 truncate">{p.title}</span>
            <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-muted group-hover:text-paper/60">
              {p.tags?.slice(0, 3).join(" · ")}
            </span>
            <span className="font-mono text-xs text-muted group-hover:text-paper/60 w-12 text-right shrink-0">
              {p.year ?? ""}
            </span>
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="py-8 font-mono text-sm text-muted">Nothing published yet.</p>
        )}
      </div>
    </div>
  );
}
