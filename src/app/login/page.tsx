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
    <div className="min-h-screen bg-[#FBF9F6]">
      <div className="sticky top-0 z-30 bg-white border-b border-zinc-100 h-[75px] flex items-center">
        <div className="w-full px-6 max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="font-serif text-2xl font-black tracking-widest text-[#111111]">ANUSHKAA</div>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 min-h-[calc(100vh-75px)]">

          {/* Left Image */}
          <aside className="hidden lg:block lg:col-span-5 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1520975919352-6a4fa9b5f9c8?auto=format&fit=crop&w=1600&q=80" alt="Luxury knitwear lifestyle" className="w-full h-full object-cover object-center transform transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="text-white text-center space-y-4 max-w-xs">
                <h3 className="font-serif text-3xl font-bold">ANUSHKAA KNITS WORLD</h3>
                <p className="text-sm font-medium tracking-wide">Luxury Knitwear</p>
                <p className="text-xs">Texvalley • Erode</p>
                <p className="mt-4 text-[13px] italic">"Crafted with Quality. Designed for Everyday Elegance."</p>
              </div>
            </div>
          </aside>

          {/* Right Card */}
          <main className="col-span-12 lg:col-span-7 flex items-center justify-center p-6">
            <div className="w-full max-w-[520px] bg-white rounded-[24px] shadow-lg p-12">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-zinc-900">{activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
                  <p className="text-sm text-zinc-500 mt-2">{activeTab === 'login' ? 'Sign in to continue shopping.' : 'Join us and enjoy premium quality knitwear.'}</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 bg-zinc-50 p-2 rounded-xl">
                  <button onClick={() => switchTab('login')} className={`${activeTab === 'login' ? 'bg-white shadow-md' : ''} flex-1 py-2 rounded-lg font-bold`}>Login</button>
                  <button onClick={() => switchTab('register')} className={`${activeTab === 'register' ? 'bg-white shadow-md' : ''} flex-1 py-2 rounded-lg font-bold`}>Register</button>
                </div>

                {/* Content */}
                <div style={{ opacity: isAnimating ? 0 : 1, transition: 'opacity 0.2s' }}>
                  {activeTab === 'login' ? (
                    <>
                      <button onClick={loginWithGoogle} className="w-full rounded-xl py-3.5 bg-white border border-zinc-200 flex items-center justify-center gap-3 font-bold"> <GoogleIcon/> Continue with Google</button>
                      <div className="my-4 text-center text-xs text-zinc-400">or sign in with email</div>

                      {loginError && <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-sm">{loginError}</div>}

                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold">Email Address</label>
                          <input id="login-email" value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginError(''); }} type="email" className="w-full mt-2 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#C8A24D]/20 outline-none" placeholder="you@example.com" />
                        </div>

                        <div>
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold">Password</label>
                            <Link href="/forgot-password" className="text-xs text-[#C8A24D] font-bold">Forgot Password?</Link>
                          </div>
                          <div className="relative mt-2">
                            <input id="login-password" value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError(''); }} type={showLoginPwd ? 'text' : 'password'} className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#C8A24D]/20 outline-none" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowLoginPwd(p => !p)} className="absolute right-3 top-3 text-zinc-500">{showLoginPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input id="remember-me" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 accent-[#C8A24D]" />
                          <label className="text-xs text-zinc-500">Remember Me</label>
                        </div>

                        <button type="submit" className="w-full bg-[#C8A24D] hover:bg-[#b8922d] text-white py-3.5 rounded-xl font-extrabold">{loginLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Signing In…</> : 'GOLD LOGIN'}</button>

                      </form>

                      <div className="mt-3">
                        <button onClick={loginWithGoogle} className="w-full bg-white border border-zinc-200 py-3 rounded-xl font-bold">Continue with Google</button>
                      </div>

                      <p className="text-center text-sm text-zinc-500 mt-3">New here? <button onClick={() => switchTab('register')} className="text-[#C8A24D] font-bold">Create Account</button></p>
                    </>
                  ) : (
                    <>
                      {/* Register Form - keep existing handlers */}
                      <button onClick={loginWithGoogle} className="w-full rounded-xl py-3.5 bg-white border border-zinc-200 flex items-center justify-center gap-3 font-bold"> <GoogleIcon/> Continue with Google</button>
                      <div className="my-4 text-center text-xs text-zinc-400">or register with email</div>

                      {regError && <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-sm">{regError}</div>}

                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold">Full Name</label>
                          <input id="reg-name" value={regName} onChange={e => { setRegName(e.target.value); setNameErr(''); }} type="text" className="w-full mt-2 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#C8A24D]/20 outline-none" placeholder="Your Full Name" />
                          {nameErr && <p className="text-rose-500 text-xs mt-1">{nameErr}</p>}
                        </div>

                        <div>
                          <label className="text-xs font-semibold">Mobile Number</label>
                          <div className="flex gap-2 mt-2">
                            <span className="inline-flex items-center px-3 bg-zinc-50 border border-zinc-200 rounded-xl">+91</span>
                            <input id="reg-mobile" value={regMobile} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0,10); setRegMobile(v); setMobileErr(''); }} type="tel" className="flex-1 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#C8A24D]/20 outline-none" placeholder="9XXXXXXXXX" />
                          </div>
                          {mobileErr && <p className="text-rose-500 text-xs mt-1">{mobileErr}</p>} 
                        </div>

                        <div>
                          <label className="text-xs font-semibold">Email Address</label>
                          <input id="reg-email" value={regEmail} onChange={e => { setRegEmail(e.target.value); setEmailErr(''); }} type="email" className="w-full mt-2 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#C8A24D]/20 outline-none" placeholder="you@example.com" />
                          {emailErr && <p className="text-rose-500 text-xs mt-1">{emailErr}</p>}
                        </div>

                        <div>
                          <label className="text-xs font-semibold">Password</label>
                          <div className="relative mt-2">
                            <input id="reg-password" value={regPassword} onChange={e => { setRegPassword(e.target.value); setPwdErr(''); }} type={showRegPwd ? 'text' : 'password'} className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#C8A24D]/20 outline-none" placeholder="Min. 8 characters" />
                            <button type="button" onClick={() => setShowRegPwd(p => !p)} className="absolute right-3 top-3 text-zinc-500">{showRegPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                          </div>
                          {pwdErr && <p className="text-rose-500 text-xs mt-1">{pwdErr}</p>}
                        </div>

                        <div>
                          <label className="text-xs font-semibold">Confirm Password</label>
                          <div className="relative mt-2">
                            <input id="reg-confirm" value={regConfirm} onChange={e => { setRegConfirm(e.target.value); setConfirmErr(''); }} type={showConfirm ? 'text' : 'password'} className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#C8A24D]/20 outline-none" placeholder="Re-enter your password" />
                            <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-3 text-zinc-500">{showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                          </div>
                          {confirmErr && <p className="text-rose-500 text-xs mt-1">{confirmErr}</p>}
                        </div>

                        <button type="submit" className="w-full bg-[#C8A24D] hover:bg-[#b8922d] text-white py-3.5 rounded-xl font-extrabold">{regLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Creating…</> : 'Create Account'}</button>
                      </form>

                      <p className="text-center text-sm text-zinc-500 mt-3">Already have an account? <button onClick={() => switchTab('login')} className="text-[#C8A24D] font-bold">Sign In</button></p>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-400"> <ShieldCheck className="inline-block mr-2"/> 256-Bit SSL • Secured by Supabase Auth</div>

              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
