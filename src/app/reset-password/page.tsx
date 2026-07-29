"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Password strength helper (same as login page)
function getPasswordStrength(p: string): { score: number; label: string; color: string } {
  let s = 0;
  if (p.length >= 8)          s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[a-z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 1) return { score: s, label: "Weak",   color: "#EF4444" };
  if (s <= 3) return { score: s, label: "Medium",  color: "#F59E0B" };
  return             { score: s, label: "Strong",  color: "#10B981" };
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  const strength = getPasswordStrength(password);
  const pwdCriteria = [
    { ok: password.length >= 8,          label: "8+ characters"   },
    { ok: /[A-Z]/.test(password),        label: "Uppercase"       },
    { ok: /[a-z]/.test(password),        label: "Lowercase"       },
    { ok: /[0-9]/.test(password),        label: "Number"          },
    { ok: /[^A-Za-z0-9]/.test(password), label: "Special char"   },
  ];

  // Verify the user arrived via a valid password reset link
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError("Password must be 8+ characters with uppercase, lowercase, number & special character.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) {
        setError(updateErr.message || "Failed to reset password. Please try again.");
      } else {
        setSuccess(true);
        await supabase.auth.signOut();
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch {
      setError("Failed to reset password. Please request a new link.");
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

        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-zinc-100 p-7 sm:p-9 space-y-6">
          {/* Loading session */}
          {hasSession === null && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8A24D] mx-auto" />
              <p className="text-xs text-zinc-500 mt-3">Verifying reset link…</p>
            </div>
          )}

          {/* Invalid / expired link */}
          {hasSession === false && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-zinc-900">Link Expired</h1>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  This password reset link is invalid or has expired.<br />
                  Please request a new one.
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 bg-[#C8A24D] hover:bg-[#b8922d] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
              >
                Request New Link
              </Link>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-zinc-900">Password Reset!</h1>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Your password has been updated successfully.<br />
                  Redirecting you to sign in…
                </p>
              </div>
            </div>
          )}

          {/* Reset form */}
          {hasSession === true && !success && (
            <>
              <div className="text-center">
                <h1 className="font-serif font-bold text-xl text-zinc-900">Create New Password</h1>
                <p className="text-xs text-zinc-500 mt-2">Choose a strong password for your account.</p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off" noValidate className="space-y-4">
                {/* New password */}
                <div className="space-y-1.5">
                  <label htmlFor="new-password" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="new-password"
                      type={showPwd ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/10 transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength */}
                  {password.length > 0 && (
                    <div className="space-y-2 pt-0.5">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: i <= strength.score ? strength.color : "#F3F4F6" }} />
                        ))}
                      </div>
                      <p className="text-[10px] font-bold" style={{ color: strength.color }}>
                        {strength.label} Password
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                        {pwdCriteria.map(({ ok, label }) => (
                          <span key={label} className={`text-[10px] flex items-center gap-1 ${ok ? "text-emerald-600" : "text-zinc-400"}`}>
                            <span className="text-[8px]">{ok ? "✓" : "○"}</span>{label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirm-password" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      id="confirm-password"
                      type={showConf ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="Re-enter new password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setError(""); }}
                      className={`w-full bg-zinc-50 border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                        confirm && password !== confirm
                          ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                          : confirm && password === confirm
                          ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100"
                          : "border-zinc-200 focus:border-[#C8A24D] focus:ring-[#C8A24D]/10"
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConf(p => !p)}
                      className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm.length > 0 && password !== confirm && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="reset-password-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C8A24D] hover:bg-[#b8922d] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#C8A24D]/20 transition-all"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Updating Password…</span></>
                    : <><span>Reset Password</span><CheckCircle2 className="w-4 h-4" /></>
                  }
                </button>
              </form>
            </>
          )}

          {/* Security badge */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL • Secured by Supabase</span>
          </div>
        </div>

        <p className="text-center mt-6 text-[11px] text-zinc-400">
          <Link href="/login" className="hover:text-[#C8A24D] transition-colors font-medium">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
