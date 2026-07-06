import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/lib/types";

export const metadata = { title: "Log — Aswin T." };

export default async function ArticlesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  const articles = (data as Article[]) ?? [];

  return (
    <div className="px-6 md:px-10 pt-32 pb-24 max-w-3xl mx-auto">
      <h1 className="font-display text-5xl md:text-7xl mb-16">Log</h1>
      <div className="space-y-12">
        {articles.map((a) => (
          <Link key={a.id} href={`/articles/${a.slug}`} className="group block">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
              {a.published_at ? new Date(a.published_at).toLocaleDateString() : ""}
            </p>
            <h2 className="font-display text-2xl md:text-3xl group-hover:text-cobalt transition-colors">
              {a.title}
            </h2>
            <p className="text-muted mt-2">{a.excerpt}</p>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="font-mono text-sm text-muted">Nothing published yet.</p>
        )}
      </div>
    </div>
  );
}
