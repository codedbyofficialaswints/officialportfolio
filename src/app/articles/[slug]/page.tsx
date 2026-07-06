import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/lib/types";

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("articles").select("*").eq("slug", params.slug).single();

  if (!data) notFound();
  const article = data as Article;

  return (
    <article className="px-6 md:px-10 pt-32 pb-24 max-w-2xl mx-auto">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
        {article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}
      </p>
      <h1 className="font-display text-4xl md:text-6xl mb-12">{article.title}</h1>
      <div className="prose prose-neutral max-w-none whitespace-pre-wrap font-body text-base leading-relaxed">
        {article.content}
      </div>
    </article>
  );
}
