"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      // Always show the same message regardless of whether account exists (privacy)
      await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      setSubmitted(true);
    } catch {
      // Still show success to avoid revealing account existence
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-0.5 group">
            <span className="font-serif text-3xl font-black tracking-widest text-[#111111] group-hover:text-[#C8A24D] transition-colors">
              ANUSHKAA
            </span>
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C8A24D]">
              KNITS WORLD • TEXVALLEY
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-zinc-100 p-7 sm:p-9 space-y-6">
          {submitted ? (
            /* ── Success state ──────────────────────────── */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-zinc-900">Check Your Email</h1>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  If an account exists, a password reset link has been sent.<br />
                  Please check your inbox and spam folder.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#C8A24D] hover:bg-[#b8922d] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            /* ── Form state ─────────────────────────────── */
            <>
              <div className="text-center">
                <h1 className="font-serif font-bold text-xl text-zinc-900">Reset Password</h1>
                <p className="text-xs text-zinc-500 mt-2">
                  Enter your registered email address to receive a password reset link.
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} autoComplete="off" noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/10 transition-all"
                    />
                  </div>
                </div>

                <button
                  id="send-reset-link"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C8A24D] hover:bg-[#b8922d] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#C8A24D]/20 transition-all"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending Link…</span></>
                    : <><span>Send Password Reset Link</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>

              <p className="text-center text-xs text-zinc-500">
                Remembered your password?{" "}
                <Link href="/login" className="font-bold text-[#C8A24D] hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          )}

          {/* Security badge */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL • Secured by Supabase</span>
          </div>
        </div>

        <p className="text-center mt-6 text-[11px] text-zinc-400">
          <Link href="/" className="hover:text-[#C8A24D] transition-colors font-medium">
            ← Back to ANUSHKAA KNITS WORLD
          </Link>
        </p>
      </div>
    </div>
  );
}
