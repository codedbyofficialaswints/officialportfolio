import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/lib/types";

export default async function AdminArticlesPage() {
  const supabase = createClient();
  const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  const articles = (data as Article[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Articles</h1>
        <Link href="/admin/articles/new" className="bg-ink text-paper font-mono text-xs uppercase tracking-widest px-4 py-2.5">
          + New article
        </Link>
      </div>
      <div className="bg-white border hairline divide-y hairline">
        {articles.map((a) => (
          <Link key={a.id} href={`/admin/articles/${a.id}/edit`} className="flex items-center gap-4 px-4 py-3 hover:bg-[#f4f3ef]">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${a.status === "published" ? "bg-green-500" : "bg-yellow-500"}`}
            />
            <span className="flex-1 font-medium">{a.title}</span>
            <span className="font-mono text-xs text-muted">
              {a.published_at ? new Date(a.published_at).toLocaleDateString() : "—"}
            </span>
          </Link>
        ))}
        {articles.length === 0 && <p className="p-6 font-mono text-sm text-muted">No articles yet.</p>}
      </div>
    </div>
  );
}
