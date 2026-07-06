"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ImageUploader({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      setError(
        error.message.includes("Bucket not found")
          ? "Create a public 'media' bucket in Supabase Storage first (see README)."
          : error.message
      );
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label className="font-mono text-xs uppercase tracking-widest text-muted">{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-full max-w-xs aspect-video object-cover border hairline" />
      )}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="block font-mono text-xs"
      />
      {uploading && <p className="text-xs text-muted font-mono">Uploading…</p>}
      {error && <p className="text-xs text-coral font-mono">{error}</p>}
    </div>
  );
}
