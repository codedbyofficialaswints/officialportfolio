import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/lib/types";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!data) notFound();
  const project = data as Project;

  return (
    <article className="px-6 md:px-10 pt-32 pb-24 max-w-4xl mx-auto">
      <div className="font-mono text-xs uppercase tracking-widest text-muted mb-4 flex gap-4">
        {project.client && <span>{project.client}</span>}
        {project.year && <span>{project.year}</span>}
        {project.role && <span>{project.role}</span>}
      </div>
      <h1 className="font-display text-4xl md:text-6xl mb-8">{project.title}</h1>
      {project.summary && <p className="text-lg text-muted max-w-2xl mb-12">{project.summary}</p>}

      {project.cover_image_url && (
        <div className="relative w-full aspect-[16/10] mb-12 bg-line">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {project.description && (
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap font-body text-base leading-relaxed">
          {project.description}
        </div>
      )}

      {project.gallery?.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {project.gallery.map((url, i) => (
            <div key={i} className="relative aspect-[4/3] bg-line">
              <Image src={url} alt={`${project.title} ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {project.link_url && (
        <a
          href={project.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-12 font-mono text-xs uppercase tracking-widest border-b border-ink pb-0.5"
        >
          Visit live project →
        </a>
      )}
    </article>
  );
}
