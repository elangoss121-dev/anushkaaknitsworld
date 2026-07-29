"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import {
  Mail, Lock, Eye, EyeOff, User,
  ArrowRight, ShieldCheck, AlertCircle,
  CheckCircle2, Loader2, Clock
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "login" | "register";

// ── Password Strength ─────────────────────────────────────────────────────────
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

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 5 * 60 * 1000; // 5 minutes

function getRateLimit(email: string) {
  try {
    const key  = `akw_rl_${email.toLowerCase().trim()}`;
    const raw  = localStorage.getItem(key);
    if (!raw) return { locked: false, remaining: 0, attemptsLeft: MAX_ATTEMPTS };
    const { attempts, lockedUntil } = JSON.parse(raw);
    if (lockedUntil && Date.now() < lockedUntil) {
      return { locked: true, remaining: lockedUntil - Date.now(), attemptsLeft: 0 };
    }
    return { locked: false, remaining: 0, attemptsLeft: MAX_ATTEMPTS - (attempts || 0) };
  } catch { return { locked: false, remaining: 0, attemptsLeft: MAX_ATTEMPTS }; }
}

function recordFailedAttempt(email: string): { locked: boolean; attemptsLeft: number } {
  try {
    const key  = `akw_rl_${email.toLowerCase().trim()}`;
    const raw  = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null };
    if (data.lockedUntil && Date.now() > data.lockedUntil) {
      data.attempts = 0; data.lockedUntil = null;
    }
    data.attempts = (data.attempts || 0) + 1;
    if (data.attempts >= MAX_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_MS;
      localStorage.setItem(key, JSON.stringify(data));
      return { locked: true, attemptsLeft: 0 };
    }
    localStorage.setItem(key, JSON.stringify(data));
    return { locked: false, attemptsLeft: MAX_ATTEMPTS - data.attempts };
  } catch { return { locked: false, attemptsLeft: MAX_ATTEMPTS }; }
}

function clearRateLimit(email: string) {
  try { localStorage.removeItem(`akw_rl_${email.toLowerCase().trim()}`); } catch {}
}

// ── Google Icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function AuthPage() {
  const router = useRouter();
  const { user, role, loginWithGoogle, loginWithEmail, registerWithEmail } = useShop();

  // ── Tab ───────────────────────────────────────────────────────────────────
  const [activeTab,  setActiveTab]  = useState<Tab>("login");
  const [isAnimating, setIsAnimating] = useState(false);

  // ── Login ──────────────────────────────────────────────────────────────────
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd,  setShowLoginPwd]  = useState(false);
  const [rememberMe,    setRememberMe]    = useState(true);
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginError,    setLoginError]    = useState("");
  const [lockoutMs,     setLockoutMs]     = useState(0);

  // ── Register ──────────────────────────────────────────────────────────────
  const [regName,       setRegName]       = useState("");
  const [regMobile,     setRegMobile]     = useState("");
  const [regEmail,      setRegEmail]      = useState("");
  const [regPassword,   setRegPassword]   = useState("");
  const [regConfirm,    setRegConfirm]    = useState("");
  const [showRegPwd,    setShowRegPwd]    = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [regLoading,    setRegLoading]    = useState(false);
  const [regError,      setRegError]      = useState("");
  const [regSuccess,    setRegSuccess]    = useState(false);

  // ── Field errors ──────────────────────────────────────────────────────────
  const [nameErr,    setNameErr]    = useState("");
  const [mobileErr,  setMobileErr]  = useState("");
  const [emailErr,   setEmailErr]   = useState("");
  const [pwdErr,     setPwdErr]     = useState("");
  const [confirmErr, setConfirmErr] = useState("");

  const strength = getPasswordStrength(regPassword);

  // Read ?tab= param from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "register") setActiveTab("register");
  }, []);

  // Redirect already-authenticated users
  useEffect(() => {
    if (!user) return;
    if (role === "Admin" || user.role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      router.push("/account/dashboard");
    }
  }, [user, role, router]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutMs <= 0) return;
    const id = setInterval(() => {
      setLockoutMs(prev => {
        if (prev <= 1000) { setLoginError(""); return 0; }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [lockoutMs]);

  // ── Tab switch ─────────────────────────────────────────────────────────────
  const switchTab = (tab: Tab) => {
    if (tab === activeTab || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => { setActiveTab(tab); setIsAnimating(false); }, 200);
  };

  // ── Login submit ───────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }

    // Check lockout
    const rl = getRateLimit(loginEmail);
    if (rl.locked) {
      const mins = Math.ceil(rl.remaining / 60000);
      setLoginError(`Too many failed attempts. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`);
      setLockoutMs(rl.remaining);
      return;
    }

    setLoginLoading(true);
    try {
      const res = await loginWithEmail(loginEmail.trim(), loginPassword);
      if (res.success) {
        clearRateLimit(loginEmail);
        router.push(res.redirectUrl || "/account/dashboard");
      } else {
        const { locked, attemptsLeft } = recordFailedAttempt(loginEmail);
        if (locked) {
          setLoginError("Too many failed login attempts. Account temporarily locked for 5 minutes.");
          setLockoutMs(LOCKOUT_MS);
        } else {
          const suffix = attemptsLeft > 0
            ? ` (${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} left before lockout)`
            : "";
          setLoginError((res.error || "Invalid email or password.") + suffix);
        }
      }
    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Register submit ────────────────────────────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setNameErr(""); setMobileErr(""); setEmailErr(""); setPwdErr(""); setConfirmErr("");

    let hasErr = false;
    if (!regName.trim() || regName.trim().length < 3) {
      setNameErr("Full name must be at least 3 characters."); hasErr = true;
    }
    if (!/^[6-9]\d{9}$/.test(regMobile)) {
      setMobileErr("Enter a valid 10-digit Indian mobile number (starts with 6–9)."); hasErr = true;
    }
    if (!regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setEmailErr("Enter a valid email address."); hasErr = true;
    }
    if (
      regPassword.length < 8 ||
      !/[A-Z]/.test(regPassword) ||
      !/[a-z]/.test(regPassword) ||
      !/[0-9]/.test(regPassword) ||
      !/[^A-Za-z0-9]/.test(regPassword)
    ) {
      setPwdErr("Password must be 8+ chars with uppercase, lowercase, number & special character.");
      hasErr = true;
    }
    if (regPassword !== regConfirm) {
      setConfirmErr("Passwords do not match."); hasErr = true;
    }
    if (hasErr) return;

    setRegLoading(true);
    try {
      const res = await registerWithEmail(regName.trim(), regMobile, regEmail.toLowerCase().trim(), regPassword);
      if (res.success) {
        setRegSuccess(true);
      } else {
        setRegError(res.error || "Registration failed. Please try again.");
      }
    } catch {
      setRegError("Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  // ── Shared UI atoms ────────────────────────────────────────────────────────
  const GoogleButton = ({ label }: { label: string }) => (
    <button
      type="button"
      onClick={loginWithGoogle}
      className="w-full bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 hover:border-zinc-300 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
    >
      <GoogleIcon /><span>{label}</span>
    </button>
  );

  const Divider = ({ text }: { text: string }) => (
    <div className="relative flex items-center my-1">
      <div className="flex-1 border-t border-zinc-100" />
      <span className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
        {text}
      </span>
      <div className="flex-1 border-t border-zinc-100" />
    </div>
  );

  const FieldError = ({ msg }: { msg: string }) =>
    msg ? <p className="text-[10px] text-rose-500 font-semibold mt-1">{msg}</p> : null;

  const pwdCriteria = [
    { ok: regPassword.length >= 8,          label: "8+ characters"   },
    { ok: /[A-Z]/.test(regPassword),        label: "Uppercase"       },
    { ok: /[a-z]/.test(regPassword),        label: "Lowercase"       },
    { ok: /[0-9]/.test(regPassword),        label: "Number"          },
    { ok: /[^A-Za-z0-9]/.test(regPassword), label: "Special char"   },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">

        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-0.5 group">
            <span className="font-serif text-3xl font-black tracking-widest text-[#111111] group-hover:text-[#C8A24D] transition-colors duration-300">
              ANUSHKAA
            </span>
            <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#C8A24D]">
              KNITS WORLD • TEXVALLEY
            </span>
          </Link>
        </div>

        {/* ── Card ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-zinc-100 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-zinc-100">
            {(["login", "register"] as Tab[]).map(tab => (
              <button
                key={tab}
                id={`auth-tab-${tab}`}
                type="button"
                onClick={() => switchTab(tab)}
                aria-selected={activeTab === tab}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors relative ${
                  activeTab === tab ? "text-[#111111]" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {tab === "login" ? "Login" : "Register"}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8A24D]" />
                )}
              </button>
            ))}
          </div>

          {/* Content with fade animation */}
          <div
            className="p-7 sm:p-9"
            style={{ opacity: isAnimating ? 0 : 1, transition: "opacity 0.2s ease-in-out" }}
          >
            {/* ════════════════════ LOGIN TAB ════════════════════ */}
            {activeTab === "login" && (
              <div className="space-y-5">
                <GoogleButton label="Continue with Google" />
                <Divider text="or sign in with email" />

                {/* Error / lockout banner */}
                {loginError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-semibold flex items-start gap-2">
                    {lockoutMs > 0
                      ? <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    }
                    <div>
                      <p>{loginError}</p>
                      {lockoutMs > 0 && (
                        <p className="font-black mt-1 text-rose-800 tabular-nums">
                          {Math.floor(lockoutMs / 60000)}:{String(Math.floor((lockoutMs % 60000) / 1000)).padStart(2, "0")} remaining
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <form
                  id="login-form"
                  onSubmit={handleLoginSubmit}
                  autoComplete="off"
                  noValidate
                  className="space-y-4"
                >
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="login-email" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="login-password" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        Password
                      </label>
                      <Link href="/forgot-password" className="text-[10px] font-bold text-[#C8A24D] hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                      <input
                        id="login-password"
                        type={showLoginPwd ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/10 transition-all"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-label={showLoginPwd ? "Hide password" : "Show password"}
                        onClick={() => setShowLoginPwd(p => !p)}
                        className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer select-none w-fit">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-zinc-300 accent-[#C8A24D]"
                    />
                    <span className="text-[11px] text-zinc-500">Keep me signed in for 30 days</span>
                  </label>

                  {/* Submit */}
                  <button
                    id="login-submit"
                    type="submit"
                    disabled={loginLoading || lockoutMs > 0}
                    className="w-full bg-[#C8A24D] hover:bg-[#b8922d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#C8A24D]/20 transition-all"
                  >
                    {loginLoading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing In…</span></>
                      : <><span>Login</span><ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                </form>

                <p className="text-center text-xs text-zinc-500 pt-1">
                  New here?{" "}
                  <button type="button" onClick={() => switchTab("register")} className="font-bold text-[#C8A24D] hover:underline">
                    Create an Account
                  </button>
                </p>
              </div>
            )}

            {/* ════════════════════ REGISTER TAB ════════════════════ */}
            {activeTab === "register" && (
              <div className="space-y-5">
                {/* Success state */}
                {regSuccess ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-lg text-zinc-900">Account Created!</h2>
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                        Welcome to ANUSHKAA KNITS WORLD.<br />
                        Please check your email to verify your account,<br />then sign in below.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchTab("login")}
                      className="inline-flex items-center gap-2 bg-[#C8A24D] hover:bg-[#b8922d] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
                    >
                      <span>Go to Sign In</span><ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <GoogleButton label="Continue with Google" />
                    <Divider text="or register with email" />

                    {/* Error banner */}
                    {regError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-semibold flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <form
                      id="register-form"
                      onSubmit={handleRegisterSubmit}
                      autoComplete="off"
                      noValidate
                      className="space-y-4"
                    >
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-name" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                          <input
                            id="reg-name"
                            type="text"
                            required
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="words"
                            spellCheck={false}
                            placeholder="Your Full Name"
                            value={regName}
                            onChange={e => { setRegName(e.target.value); setNameErr(""); }}
                            className={`w-full bg-zinc-50 border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              nameErr
                                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                                : "border-zinc-200 focus:border-[#C8A24D] focus:ring-[#C8A24D]/10"
                            }`}
                          />
                        </div>
                        <FieldError msg={nameErr} />
                      </div>

                      {/* Mobile */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-mobile" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                          Mobile Number *
                        </label>
                        <div className={`flex border rounded-xl overflow-hidden bg-zinc-50 transition-all ${
                          mobileErr
                            ? "border-rose-400 focus-within:ring-2 focus-within:ring-rose-100"
                            : "border-zinc-200 focus-within:border-[#C8A24D] focus-within:ring-2 focus-within:ring-[#C8A24D]/10"
                        }`}>
                          <span className="bg-zinc-100 border-r border-zinc-200 px-3 flex items-center text-xs font-bold text-zinc-500 shrink-0 select-none">
                            +91
                          </span>
                          <input
                            id="reg-mobile"
                            type="tel"
                            required
                            autoComplete="off"
                            placeholder="9XXXXXXXXX"
                            maxLength={10}
                            value={regMobile}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setRegMobile(v); setMobileErr("");
                            }}
                            className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none"
                          />
                        </div>
                        <FieldError msg={mobileErr} />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-email" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                          <input
                            id="reg-email"
                            type="email"
                            required
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="you@example.com"
                            value={regEmail}
                            onChange={e => { setRegEmail(e.target.value); setEmailErr(""); }}
                            className={`w-full bg-zinc-50 border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              emailErr
                                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                                : "border-zinc-200 focus:border-[#C8A24D] focus:ring-[#C8A24D]/10"
                            }`}
                          />
                        </div>
                        <FieldError msg={emailErr} />
                      </div>

                      {/* Create Password */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-password" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                          Create Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                          <input
                            id="reg-password"
                            type={showRegPwd ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="Min. 8 characters"
                            value={regPassword}
                            onChange={e => { setRegPassword(e.target.value); setPwdErr(""); }}
                            className={`w-full bg-zinc-50 border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              pwdErr
                                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                                : "border-zinc-200 focus:border-[#C8A24D] focus:ring-[#C8A24D]/10"
                            }`}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={showRegPwd ? "Hide" : "Show"}
                            onClick={() => setShowRegPwd(p => !p)}
                            className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                          >
                            {showRegPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Strength meter */}
                        {regPassword.length > 0 && (
                          <div className="space-y-2 pt-0.5">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div
                                  key={i}
                                  className="flex-1 h-1 rounded-full transition-all duration-300"
                                  style={{ backgroundColor: i <= strength.score ? strength.color : "#F3F4F6" }}
                                />
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
                        <FieldError msg={pwdErr} />
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-confirm" className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
                          <input
                            id="reg-confirm"
                            type={showConfirm ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="Re-enter your password"
                            value={regConfirm}
                            onChange={e => { setRegConfirm(e.target.value); setConfirmErr(""); }}
                            className={`w-full bg-zinc-50 border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              (regConfirm && regPassword !== regConfirm) || confirmErr
                                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                                : regConfirm && regPassword === regConfirm
                                ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100"
                                : "border-zinc-200 focus:border-[#C8A24D] focus:ring-[#C8A24D]/10"
                            }`}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={showConfirm ? "Hide" : "Show"}
                            onClick={() => setShowConfirm(p => !p)}
                            className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                          >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {regConfirm.length > 0 && regPassword !== regConfirm && !confirmErr && (
                          <p className="text-[10px] text-rose-500 font-semibold mt-1">Passwords do not match</p>
                        )}
                        <FieldError msg={confirmErr} />
                      </div>

                      {/* Submit */}
                      <button
                        id="register-submit"
                        type="submit"
                        disabled={regLoading}
                        className="w-full bg-[#C8A24D] hover:bg-[#b8922d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#C8A24D]/20 transition-all"
                      >
                        {regLoading
                          ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating Account…</span></>
                          : <><span>Create Account</span><CheckCircle2 className="w-4 h-4" /></>
                        }
                      </button>
                    </form>

                    <p className="text-center text-xs text-zinc-500 pt-1">
                      Already have an account?{" "}
                      <button type="button" onClick={() => switchTab("login")} className="font-bold text-[#C8A24D] hover:underline">
                        Sign In
                      </button>
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Security badge */}
            <div className="mt-8 pt-5 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit SSL • Secured by Supabase Auth</span>
            </div>
          </div>
        </div>

        {/* Back to store */}
        <p className="text-center mt-6 text-[11px] text-zinc-400">
          <Link href="/" className="hover:text-[#C8A24D] transition-colors font-medium">
            ← Back to ANUSHKAA KNITS WORLD
          </Link>
        </p>
      </div>
    </div>
  );
}
