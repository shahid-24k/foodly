"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "restaurant">("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });

      if (signUpErr) {
        // If Supabase Auth returns a trigger/database error, attempt fallback sign in or clear message
        if (signUpErr.message.toLowerCase().includes("database error") || signUpErr.message.toLowerCase().includes("saving new user")) {
          // Attempt signIn directly in case user was registered in auth.users
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
          if (!signInErr) {
            router.push(role === "restaurant" ? "/restaurant/dashboard" : "/");
            router.refresh();
            return;
          }
        }
        setError(signUpErr.message);
        setLoading(false);
        return;
      }

      // Explicitly ensure profile row is created/upserted in public.profiles
      if (data?.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: role,
        });
      }

      setLoading(false);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main className="max-w-sm mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-[#24201D] border border-line dark:border-[#332E28] rounded-2xl p-6 shadow-sm">
          <h1 className="font-display font-black text-2xl text-charcoal dark:text-white mb-2">Account Created!</h1>
          <p className="text-sm text-[#9A9488] dark:text-[#8C8477] mb-6">
            We sent a confirmation link to <strong className="text-charcoal dark:text-white">{email}</strong>. Please check your inbox, or proceed to log in.
          </p>
          <Link href="/login" className="inline-block w-full bg-mango text-white font-bold py-3 px-6 rounded-xl hover:bg-maroon transition-colors">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <div className="bg-white dark:bg-[#24201D] border border-line dark:border-[#332E28] rounded-2xl p-6 shadow-xs">
        <h1 className="font-display font-black text-2xl text-charcoal dark:text-white mb-1">Create your account</h1>
        <p className="text-sm text-[#9A9488] dark:text-[#8C8477] mb-6">Order food or manage a restaurant on FOODLY.</p>
        
        <form onSubmit={handleSignup} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#9A9488] dark:text-[#8C8477] uppercase mb-1">Full Name</label>
            <input
              required
              placeholder="e.g. Shahid Khan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-sm border border-line dark:border-[#332E28] rounded-xl px-3 py-2.5 outline-none focus:border-mango bg-cream dark:bg-[#1C1A18] text-charcoal dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9488] dark:text-[#8C8477] uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm border border-line dark:border-[#332E28] rounded-xl px-3 py-2.5 outline-none focus:border-mango bg-cream dark:bg-[#1C1A18] text-charcoal dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9488] dark:text-[#8C8477] uppercase mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm border border-line dark:border-[#332E28] rounded-xl px-3 py-2.5 outline-none focus:border-mango bg-cream dark:bg-[#1C1A18] text-charcoal dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#9A9488] dark:text-[#8C8477] uppercase mb-1">I am a</label>
            <div className="flex gap-2">
              {(["customer", "restaurant"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 text-xs font-bold py-2.5 rounded-xl border capitalize transition-colors ${
                    role === r
                      ? "bg-mango text-white border-mango"
                      : "border-line dark:border-[#332E28] text-[#55504A] dark:text-[#A8A095] bg-cream dark:bg-[#1C1A18]"
                  }`}
                >
                  {r === "restaurant" ? "Restaurant Owner" : "Customer"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-maroon/10 border border-maroon/20 rounded-xl">
              <p className="text-xs text-maroon font-semibold">{error}</p>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-mango hover:bg-maroon disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-[#9A9488] dark:text-[#8C8477] mt-5 text-center">
          Already have an account? <Link href="/login" className="font-bold text-mango">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-16 text-center text-[#9A9488]">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}
