import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/lib/types";

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
  const projects = (data as Project[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Projects</h1>
        <Link href="/admin/projects/new" className="bg-ink text-paper font-mono text-xs uppercase tracking-widest px-4 py-2.5">
          + New project
        </Link>
      </div>
      <div className="bg-white border hairline divide-y hairline">
        {projects.map((p) => (
          <Link key={p.id} href={`/admin/projects/${p.id}/edit`} className="flex items-center gap-4 px-4 py-3 hover:bg-[#f4f3ef]">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${p.status === "published" ? "bg-green-500" : "bg-yellow-500"}`}
            />
            <span className="flex-1 font-medium">{p.title}</span>
            <span className="font-mono text-xs text-muted">{p.grid_size}</span>
            <span className="font-mono text-xs text-muted w-10 text-right">{p.year ?? ""}</span>
            <span className="font-mono text-xs text-muted w-16 text-right">order {p.sort_order}</span>
          </Link>
        ))}
        {projects.length === 0 && <p className="p-6 font-mono text-sm text-muted">No projects yet.</p>}
      </div>
    </div>
  );
}
