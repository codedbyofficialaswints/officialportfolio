"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <h1 className="font-display text-3xl text-paper">Admin</h1>
        <div className="space-y-1">
          <label className="font-mono text-xs uppercase tracking-widest text-paper/60">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-paper/30 text-paper py-2 outline-none focus:border-paper"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-xs uppercase tracking-widest text-paper/60">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-paper/30 text-paper py-2 outline-none focus:border-paper"
          />
        </div>
        {error && <p className="text-coral text-sm font-mono">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-paper text-ink font-mono text-xs uppercase tracking-widest py-3 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
