"use client";

import * as React from "react";
import { useState } from "react";
import { LogIn, Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

interface SignIn2Props {
  onSignIn?: (email: string, password: string) => void | Promise<void>;
  loading?: boolean;
  errorMessage?: string | null;
  title?: string;
  subtitle?: string;
  signupUrl?: string;
}

const SignIn2 = ({
  onSignIn,
  loading: externalLoading,
  errorMessage: externalError,
  title = "Sign in with email",
  subtitle = "Welcome back to FOODLY. Order your favorite dishes in seconds.",
  signupUrl = "/signup",
}: SignIn2Props = {}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [internalError, setInternalError] = useState("");

  const error = externalError !== undefined ? externalError : internalError;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setInternalError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setInternalError("Please enter a valid email address.");
      return;
    }
    setInternalError("");

    if (onSignIn) {
      await onSignIn(email, password);
    } else {
      alert("Sign in successful! (Demo)");
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center py-8 px-4 z-1">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 via-white to-white dark:from-[#24201D] dark:to-[#1A202C] rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 dark:border-white/10 text-black dark:text-white transition-colors">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-[#2D3748] mb-6 shadow-lg border border-gray-100 dark:border-transparent">
          <LogIn className="w-7 h-7 text-primary dark:text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-text-main dark:text-white">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-[#8C8477] text-sm mb-6 text-center">
          {subtitle}
        </p>

        <form onSubmit={handleSignIn} className="w-full">
          <div className="w-full flex flex-col gap-3 mb-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                placeholder="Email"
                type="email"
                required
                value={email}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-gray-800 text-black dark:text-white text-sm transition-colors"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                placeholder="Password"
                type="password"
                required
                value={password}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-gray-800 text-black dark:text-white text-sm transition-colors"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-between items-center text-xs">
              {error ? (
                <div className="text-xs text-red-500 font-medium">{error}</div>
              ) : (
                <span />
              )}
              <button type="button" className="text-xs hover:underline font-medium text-primary">
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={externalLoading}
            className="w-full bg-gradient-to-b from-primary to-primary-dark text-white font-medium py-3 rounded-xl shadow hover:brightness-105 disabled:opacity-60 cursor-pointer transition mb-4 mt-2 flex items-center justify-center gap-2"
          >
            {externalLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </form>

        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200 dark:border-gray-700"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
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

        {signupUrl && (
          <p className="text-xs text-gray-500 dark:text-[#8C8477] mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link href={signupUrl} className="font-bold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export { SignIn2 };
export default SignIn2;
