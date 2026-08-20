"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (authError) {
      const msg = authError.message.toLowerCase();
      if (
        msg.includes("invalid login credentials") ||
        msg.includes("invalid_credentials")
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (msg.includes("email not confirmed")) {
        setError(
          "Your email hasn't been confirmed yet. Check your inbox for a confirmation link."
        );
      } else {
        setError(authError.message);
      }
      return;
    }

    router.push(params.get("next") || "/");
    router.refresh();
  };

  return (
    <SignIn2
      onSignIn={handleLogin}
      loading={loading}
      errorMessage={error}
      title="Welcome back"
      subtitle="Sign in to your FOODLY account to order and track deliveries."
      signupUrl="/signup"
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-sm mx-auto px-4 py-16 text-center text-text-muted">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
