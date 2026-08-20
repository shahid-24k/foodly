"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CleanMinimalSignUp } from "@/components/ui/clean-minimal-sign-up";

function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSignup = async ({
    fullName,
    email,
    password,
    role,
  }: {
    fullName: string;
    email: string;
    password: string;
    role: "customer" | "restaurant";
  }) => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (signUpErr) {
        const msg = (signUpErr.message || "").toLowerCase();
        if (
          msg.includes("already registered") ||
          msg.includes("already been registered") ||
          msg.includes("user already exists")
        ) {
          setError("An account with this email already exists. Please log in instead.");
        } else if (
          msg.includes("valid email") ||
          msg.includes("invalid") ||
          msg.includes("email address")
        ) {
          setError("Please enter a valid email address.");
        } else if (
          msg.includes("password") &&
          (msg.includes("short") || msg.includes("least 6"))
        ) {
          setError("Password must be at least 6 characters.");
        } else {
          setError(signUpErr.message || "Unable to create your account. Please try again.");
        }
        setLoading(false);
        return;
      }

      // If user was created and session is immediately active
      if (data?.session) {
        if (data.user?.id) {
          try {
            await supabase.from("profiles").upsert(
              {
                id: data.user.id,
                email,
                full_name: fullName,
                role,
              },
              { onConflict: "id" }
            );
          } catch {
            // Background database trigger or fallback
          }
        }

        router.push(role === "restaurant" ? "/restaurant/dashboard" : "/");
        router.refresh();
        return;
      }

      // Email confirmation required
      setLoading(false);
      setDone(true);
    } catch {
      setError("Unable to create your account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <CleanMinimalSignUp
      onSignUp={handleSignup}
      loading={loading}
      errorMessage={error}
      done={done}
      loginUrl="/login"
    />
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-sm mx-auto px-4 py-16 text-center text-text-muted">
          Loading…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
