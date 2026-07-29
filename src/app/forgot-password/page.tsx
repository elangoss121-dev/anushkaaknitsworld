"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const { showToast } = useShop();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("❌ Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) {
        showToast(`❌ ${error.message}`);
      } else {
        setSubmitted(true);
        showToast("📧 Password reset instructions sent to your email!");
      }
    } catch {
      showToast("❌ Unable to send password reset email. Please try again.");
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
            Reset Account Password
          </h1>
          <p className="text-xs text-zinc-500">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-900 font-serif">
              Reset Link Sent!
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              We&apos;ve sent a secure password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <Link
              href="/login"
              className="inline-block btn-gold px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md mt-2"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-semibold">
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
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Sending Reset Link...</span>
              ) : (
                <>
                  <span>Send Password Reset Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Link back to Login */}
        <div className="text-center pt-2 border-t border-zinc-100 text-xs">
          <p className="text-zinc-500">
            Remembered your password?{" "}
            <Link href="/login" className="font-bold text-[#C8A24D] hover:underline">
              Sign In Here
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
