"use client";

import * as React from "react";
import { useState } from "react";
import { UserPlus, Lock, Mail, User, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SignUpProps {
  onSignUp?: (data: {
    fullName: string;
    email: string;
    password: string;
    role: "customer" | "restaurant";
  }) => void | Promise<void>;
  loading?: boolean;
  errorMessage?: string | null;
  done?: boolean;
  loginUrl?: string;
}

export function CleanMinimalSignUp({
  onSignUp,
  loading: externalLoading,
  errorMessage: externalError,
  done,
  loginUrl = "/login",
}: SignUpProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "restaurant">("customer");
  const [internalError, setInternalError] = useState("");

  const error = externalError !== undefined ? externalError : internalError;

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setInternalError("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setInternalError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setInternalError("Password must be at least 6 characters.");
      return;
    }

    setInternalError("");

    if (onSignUp) {
      await onSignUp({
        fullName: trimmedName,
        email: trimmedEmail,
        password,
        role,
      });
    } else {
      alert("Sign up successful! (Demo)");
    }
  };

  if (done) {
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center py-8 px-4 z-1">
        <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 via-white to-white dark:from-[#24201D] dark:to-[#1A202C] rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 dark:border-white/10 text-black dark:text-white text-center transition-colors">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/10 text-secondary mb-6 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-text-main dark:text-white">
            Account Created!
          </h2>
          <p className="text-gray-500 dark:text-[#8C8477] text-sm mb-6">
            We sent a confirmation link to{" "}
            <strong className="text-text-main dark:text-white">{email}</strong>.
            Please check your inbox to confirm, then log in.
          </p>
          <Link
            href={loginUrl}
            className="w-full bg-gradient-to-b from-primary to-primary-dark text-white font-medium py-3 rounded-xl shadow hover:brightness-105 transition text-center"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center py-8 px-4 z-1">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 via-white to-white dark:from-[#24201D] dark:to-[#1A202C] rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 dark:border-white/10 text-black dark:text-white transition-colors">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-[#2D3748] mb-5 shadow-lg border border-gray-100 dark:border-transparent">
          <UserPlus className="w-7 h-7 text-primary dark:text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-text-main dark:text-white">
          Create an account
        </h2>
        <p className="text-gray-500 dark:text-[#8C8477] text-sm mb-5 text-center">
          Join FOODLY to order food or manage your restaurant.
        </p>

        <form onSubmit={handleSignUp} className="w-full">
          <div className="w-full flex flex-col gap-3 mb-3">
            {/* Full Name */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                placeholder="Full Name"
                type="text"
                required
                value={fullName}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-gray-800 text-black dark:text-white text-sm transition-colors"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                placeholder="Email address"
                type="email"
                required
                value={email}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-gray-800 text-black dark:text-white text-sm transition-colors"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                placeholder="Password (min 6 characters)"
                type="password"
                required
                minLength={6}
                value={password}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-gray-800 text-black dark:text-white text-sm transition-colors"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role selector */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                I am a
              </label>
              <div className="flex gap-2">
                {(["customer", "restaurant"] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${
                      role === r
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:border-primary/40"
                    }`}
                  >
                    {r === "restaurant" ? "Restaurant Owner" : "Customer"}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-500 font-medium pt-1">{error}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={externalLoading}
            className="w-full bg-gradient-to-b from-primary to-primary-dark text-white font-medium py-3 rounded-xl shadow hover:brightness-105 disabled:opacity-60 cursor-pointer transition mb-4 mt-2 flex items-center justify-center gap-2"
          >
            {externalLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </form>

        <div className="flex items-center w-full my-1">
          <div className="flex-grow border-t border-dashed border-gray-200 dark:border-gray-700"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign up with</span>
          <div className="flex-grow border-t border-dashed border-gray-200 dark:border-gray-700"></div>
        </div>

        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition grow shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition grow shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/448224/facebook.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition grow shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/511330/apple-173.svg"
              alt="Apple"
              className="w-6 h-6 dark:invert"
            />
          </button>
        </div>

        {loginUrl && (
          <p className="text-xs text-gray-500 dark:text-[#8C8477] mt-5 text-center">
            Already have an account?{" "}
            <Link href={loginUrl} className="font-bold text-primary hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default CleanMinimalSignUp;
