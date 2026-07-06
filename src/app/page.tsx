import Link from "next/link";
import Hero3D from "@/components/Hero3D";
import StatusRail from "@/components/StatusRail";
import { createClient } from "@/lib/supabase/server";
import { Project, Article } from "@/lib/types";

async function getHomeData() {
  const supabase = createClient();
  const [{ data: projects }, { data: articles }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .limit(6),
    supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);
  return {
    projects: (projects as Project[]) ?? [],
    articles: (articles as Article[]) ?? [],
  };
}

const CAPABILITIES = [
  { label: "Graphic Design", detail: "Brand identity, editorial, packaging, art direction" },
  { label: "AI & Prompt Engineering", detail: "Model workflows, custom GPTs, prompt systems" },
  { label: "Advanced Web Development", detail: "Interactive sites, 3D/WebGL, full-stack builds" },
  { label: "AI Automations", detail: "Pipelines that remove repetitive work end-to-end" },
];

export default async function HomePage() {
  const { projects, articles } = await getHomeData();

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
        <Hero3D />
        <div className="relative z-10 w-full px-6 md:px-10 pb-16 pointer-events-none">
          <h1 className="font-display text-[13vw] md:text-[8vw] leading-[0.9] tracking-tight">
            Design
            <br />
            systems.
          </h1>
        </div>
        <div className="absolute bottom-10 right-6 md:right-10 font-mono text-xs uppercase tracking-widest text-right max-w-[220px]">
          Graphic design meets AI &amp; automation. Click the grid.
        </div>
      </section>

      {/* BODY GRID: status rail + content */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 px-6 md:px-10 py-16">
        <StatusRail />

        <div className="space-y-24">
          {/* SELECTED WORK */}
          <section>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display text-3xl md:text-4xl">Selected work</h2>
              <Link href="/projects" className="font-mono text-xs uppercase tracking-widest hover:text-cobalt">
                View all →
              </Link>
            </div>
            <div className="divide-y hairline border-t hairline">
              {projects.length === 0 && (
                <p className="py-8 font-mono text-sm text-muted">
                  No published projects yet — add some from the admin panel.
                </p>
              )}
              {projects.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group flex items-center gap-6 py-6 hover:bg-ink hover:text-paper transition-colors px-2 -mx-2"
                >
                  <span className="font-mono text-xs text-muted group-hover:text-paper/60 w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-2xl md:text-4xl flex-1 truncate">{p.title}</span>
                  <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-muted group-hover:text-paper/60">
                    {p.tags?.slice(0, 2).join(" · ")}
                  </span>
                  <span className="font-mono text-xs text-muted group-hover:text-paper/60 w-12 text-right shrink-0">
                    {p.year ?? ""}
                  </span>
                  <span className="font-mono text-sm shrink-0 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* CAPABILITIES */}
          <section>
            <h2 className="font-display text-3xl md:text-4xl mb-8">What I bring</h2>
            <div className="grid sm:grid-cols-2 gap-px bg-line border hairline">
              {CAPABILITIES.map((c) => (
                <div key={c.label} className="bg-paper p-6">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-coral mb-2">{c.label}</h3>
                  <p className="text-sm text-muted">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ARTICLES */}
          {articles.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="font-display text-3xl md:text-4xl">From the log</h2>
                <Link href="/articles" className="font-mono text-xs uppercase tracking-widest hover:text-cobalt">
                  Read all →
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <Link key={a.id} href={`/articles/${a.slug}`} className="group block">
                    <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
                      {a.published_at ? new Date(a.published_at).toLocaleDateString() : ""}
                    </p>
                    <h3 className="font-display text-xl group-hover:text-cobalt transition-colors">{a.title}</h3>
                    <p className="text-sm text-muted mt-2 line-clamp-2">{a.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
