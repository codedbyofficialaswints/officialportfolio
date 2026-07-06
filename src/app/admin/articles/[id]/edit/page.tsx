import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Article } from "@/lib/types";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("articles").select("*").eq("id", params.id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Edit article</h1>
      <ArticleForm article={data as Article} />
    </div>
  );
}
