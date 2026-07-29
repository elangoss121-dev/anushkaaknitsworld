"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { Lock, Mail, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loginWithGoogle, loginWithEmail, showToast } = useShop();

  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  const handleContinueEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("❌ Please enter a valid email address!");
      return;
    }
    setStep("password");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast("❌ Please enter your password!");
      return;
    }
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        router.push("/account");
      }
    } catch {
      showToast("❌ Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F9F9FB] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-2xl space-y-8">
        {/* Header Title & Brand Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center group">
            <span className="font-serif text-2xl sm:text-3xl font-black tracking-widest text-[#111111] group-hover:text-[#C8A24D] transition-colors">
              ANUSHKAA
            </span>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8A24D] -mt-1">
              KNITS WORLD • TEXVALLEY
            </span>
          </Link>
          <h1 className="text-xl font-serif font-bold text-zinc-900 pt-2">
            Welcome Back to Luxury
          </h1>
          <p className="text-xs text-zinc-500">
            Sign in to track orders, manage addresses, and access your account.
          </p>
        </div>

        {/* 1. CONTINUE WITH GOOGLE (Official OAuth) */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 text-xs uppercase tracking-wider shadow-sm transition-all hover:shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-zinc-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest absolute">
              or continue with email
            </span>
          </div>
        </div>

        {/* 2. EMAIL LOGIN FLOW */}
        {step === "email" ? (
          <form onSubmit={handleContinueEmail} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-zinc-500">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder="customer@anushkaaknitsworld.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#C8A24D]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gold py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-zinc-500">Email Address</label>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-[10px] text-[#C8A24D] font-bold hover:underline"
                >
                  Change Email
                </button>
              </div>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-xs font-bold text-zinc-700 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-zinc-500">Password *</label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] text-[#C8A24D] font-bold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#C8A24D]"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-[#C8A24D] focus:ring-[#C8A24D]"
              />
              <label htmlFor="remember" className="text-xs text-zinc-600 cursor-pointer select-none">
                Remember Me on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Link to Register Page */}
        <div className="text-center pt-2 border-t border-zinc-100 text-xs">
          <p className="text-zinc-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-[#C8A24D] hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted & Live Supabase Connected</span>
        </div>
      </div>
    </div>
  );
}
