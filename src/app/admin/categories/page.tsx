"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"project" | "article">("project");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase.from("categories").select("*").order("kind").order("sort_order");
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await supabase.from("categories").insert({ name, slug: slugify(name), kind, sort_order: categories.length });
    setName("");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  const projectCats = categories.filter((c) => c.kind === "project");
  const articleCats = categories.filter((c) => c.kind === "article");

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-10 max-w-xl">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="flex-1 border hairline px-3 py-2 bg-white text-sm"
        />
        <select value={kind} onChange={(e) => setKind(e.target.value as "project" | "article")} className="border hairline px-3 py-2 bg-white text-sm">
          <option value="project">Project</option>
          <option value="article">Article</option>
        </select>
        <button type="submit" className="bg-ink text-paper font-mono text-xs uppercase tracking-widest px-4 py-2">
          Add
        </button>
      </form>

      {!loading && (
        <div className="grid md:grid-cols-2 gap-8">
          <CategoryList title="Project categories" items={projectCats} onDelete={handleDelete} />
          <CategoryList title="Article categories" items={articleCats} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}

function CategoryList({
  title,
  items,
  onDelete,
}: {
  title: string;
  items: Category[];
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">{title}</h2>
      <div className="bg-white border hairline divide-y hairline">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-2.5">
            <span>{c.name}</span>
            <button onClick={() => onDelete(c.id)} className="text-coral text-xs font-mono uppercase">
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="p-4 text-sm text-muted font-mono">None yet.</p>}
      </div>
    </div>
  );
}
