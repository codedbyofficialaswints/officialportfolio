import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/lib/types";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Edit project</h1>
      <ProjectForm project={data as Project} />
    </div>
  );
}
