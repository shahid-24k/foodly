"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push(params.get("next") || "/");
    router.refresh();
  };

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display font-black text-2xl text-charcoal mb-1">Welcome back</h1>
      <p className="text-sm text-[#9A9488] mb-6">Log in to order and track deliveries.</p>
      <form onSubmit={handleLogin} className="space-y-3">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full text-sm border border-line rounded-lg px-3 py-2.5 outline-none focus:border-mango" />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm border border-line rounded-lg px-3 py-2.5 outline-none focus:border-mango" />
        {error && <p className="text-xs text-maroon">{error}</p>}
        <button disabled={loading} className="w-full bg-mango disabled:opacity-60 text-white font-bold py-3 rounded-2xl">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-xs text-[#9A9488] mt-5 text-center">
        No account? <Link href="/signup" className="font-bold text-mango">Sign up</Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-16 text-center text-[#9A9488]">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
