"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import {
  Mail, Lock, Eye, EyeOff, User, Phone,
  ShieldCheck, AlertCircle, CheckCircle2, Loader2, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "login" | "register";

// ── Password Strength Calculator ──────────────────────────────────────────────
function getPasswordStrength(p: string): { score: number; label: string; color: string; percent: number } {
  let s = 0;
  if (p.length >= 8)          s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[a-z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;

  if (s === 0) return { score: 0, label: "", color: "#E5E7EB", percent: 0 };
  if (s <= 2)  return { score: s, label: "Weak", color: "#EF4444", percent: 33 };
  if (s <= 4)  return { score: s, label: "Medium", color: "#F59E0B", percent: 66 };
  return             { score: s, label: "Strong", color: "#10B981", percent: 100 };
}

// ── Rate Limiting Utilities ───────────────────────────────────────────────────
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

// ── Google Brand Icon ────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — LUXURY SPLIT AUTH PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function AuthPage() {
  const router = useRouter();
  const { user, role, loginWithGoogle, loginWithEmail, registerWithEmail } = useShop();

  // ── Active Tab ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("login");

  // ── Login Form State ──────────────────────────────────────────────────────
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd,  setShowLoginPwd]  = useState(false);
  const [rememberMe,    setRememberMe]    = useState(true);
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginError,    setLoginError]    = useState("");
  const [lockoutMs,     setLockoutMs]     = useState(0);

  // ── Register Form State ───────────────────────────────────────────────────
  const [regName,     setRegName]     = useState("");
  const [regMobile,   setRegMobile]   = useState("");
  const [regEmail,    setRegEmail]    = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm,  setRegConfirm]  = useState("");
  const [showRegPwd,  setShowRegPwd]  = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [regLoading,  setRegLoading]  = useState(false);
  const [regError,    setRegError]    = useState("");
  const [regSuccess,  setRegSuccess]  = useState(false);

  // ── Inline Field Error States ─────────────────────────────────────────────
  const [nameErr,    setNameErr]    = useState("");
  const [mobileErr,  setMobileErr]  = useState("");
  const [emailErr,   setEmailErr]   = useState("");
  const [pwdErr,     setPwdErr]     = useState("");
  const [confirmErr, setConfirmErr] = useState("");

  const strength = getPasswordStrength(regPassword);

  // Read URL query params (e.g. ?tab=register)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "register") setActiveTab("register");
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!user) return;
    if (role === "Admin" || user.role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      router.push("/account/dashboard");
    }
  }, [user, role, router]);

  // Handle Lockout timer countdown
  useEffect(() => {
    if (lockoutMs <= 0) return;
    const timer = setInterval(() => {
      setLockoutMs(prev => {
        if (prev <= 1000) { setLoginError(""); return 0; }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutMs]);

  // ── Submit Handlers ───────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Please enter both your email address and password.");
      return;
    }

    const rl = getRateLimit(loginEmail);
    if (rl.locked) {
      const mins = Math.ceil(rl.remaining / 60000);
      setLoginError(`Too many failed attempts. Account locked. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`);
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
            ? ` (${attemptsLeft} attempt${attemptsLeft !== 1 ? "s" : ""} left)`
            : "";
          setLoginError((res.error || "Invalid credentials.") + suffix);
        }
      }
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setNameErr(""); setMobileErr(""); setEmailErr(""); setPwdErr(""); setConfirmErr("");

    let hasError = false;
    if (!regName.trim() || regName.trim().length < 3) {
      setNameErr("Full name must be at least 3 characters.");
      hasError = true;
    }
    if (!/^[6-9]\d{9}$/.test(regMobile)) {
      setMobileErr("Enter a valid 10-digit Indian mobile number.");
      hasError = true;
    }
    if (!regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setEmailErr("Enter a valid email address.");
      hasError = true;
    }
    if (
      regPassword.length < 8 ||
      !/[A-Z]/.test(regPassword) ||
      !/[a-z]/.test(regPassword) ||
      !/[0-9]/.test(regPassword) ||
      !/[^A-Za-z0-9]/.test(regPassword)
    ) {
      setPwdErr("Password must contain 8+ chars with uppercase, lowercase, number & symbol.");
      hasError = true;
    }
    if (regPassword !== regConfirm) {
      setConfirmErr("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

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

  return (
    <div className="min-h-screen w-full flex bg-[#FBF9F6] dark:bg-zinc-950">
      
      {/* ── LEFT SIDE (45% DESKTOP LIFESTYLE HERO IMAGE) ───────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-zinc-900 group">
        {/* Fashion Hero Background Image */}
        <img
          src="https://images.unsplash.com/photo-1520975919352-6a4fa9b5f9c8?auto=format&fit=crop&w=1600&q=85"
          alt="Luxury Knitwear Lifestyle"
          className="w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

        {/* Brand Text Content Overlay */}
        <div className="absolute inset-0 p-12 sm:p-16 flex flex-col justify-between z-10 text-white">
          
          {/* Top Brand Tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <span className="w-8 h-[2px] bg-[#C8A24D]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#C8A24D]">
              Luxury Knitwear Since 1998
            </span>
          </motion.div>

          {/* Center Main Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 max-w-md"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-amber-200 border border-white/20">
              Texvalley • Erode Flagship
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              ANUSHKAA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-[#C8A24D]">
                KNITS WORLD
              </span>
            </h1>
            <p className="text-sm text-zinc-300 font-light italic leading-relaxed pt-2">
              &quot;Crafted with Quality. Designed for Everyday Elegance.&quot;
            </p>
          </motion.div>

          {/* Bottom Footer Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="border-t border-white/15 pt-6 flex items-center justify-between text-xs text-zinc-400 font-medium"
          >
            <span>Organic Combed Cotton</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A24D]" />
            <span>Export Surplus Hub</span>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT SIDE (55% LUXURY AUTHENTICATION CARD) ────────────────────── */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-8 lg:p-12 min-h-screen">
        
        <div className="w-full max-w-[520px] bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl p-6 sm:p-10 md:p-[50px] border border-zinc-100 dark:border-zinc-800 space-y-8">
          
          {/* Brand Mobile Logo Header (visible on smaller screens) */}
          <div className="lg:hidden text-center pb-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-black tracking-widest text-[#111111] dark:text-white">
                ANUSHKAA
              </span>
              <span className="block text-[9px] font-bold tracking-[0.3em] uppercase text-[#C8A24D]">
                KNITS WORLD • TEXVALLEY
              </span>
            </Link>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {activeTab === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light">
              {activeTab === "login"
                ? "Sign in to continue shopping."
                : "Join us and enjoy premium quality knitwear."}
            </p>
          </div>

          {/* Luxury Segmented Tab Switcher */}
          <div className="bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-xl flex gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2.5 text-xs uppercase font-extrabold tracking-wider rounded-lg transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2.5 text-xs uppercase font-extrabold tracking-wider rounded-lg transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Tab Content Container */}
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Global Login Error Banner */}
                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="login-email" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => { setLoginEmail(e.target.value); setLoginError(""); }}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3.5 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-[#C8A24D] hover:underline font-bold"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showLoginPwd ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-11 py-3.5 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPwd(prev => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#C8A24D] focus:ring-[#C8A24D] accent-[#C8A24D] cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
                      Remember Me
                    </label>
                  </div>

                  {/* GOLD LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-[#C8A24D] hover:bg-[#b8922d] text-white py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing In…</span>
                      </>
                    ) : (
                      <span>GOLD LOGIN</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center my-4">
                  <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                  <span className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                    or continue with
                  </span>
                  <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                </div>

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                {/* Bottom Switcher */}
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-[#C8A24D] font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </motion.div>
            ) : (
              /* ── REGISTER TAB ───────────────────────────────────────────── */
              <motion.div
                key="register-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Success Banner */}
                {regSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h3 className="font-serif text-lg font-bold">Account Created Successfully!</h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Welcome to ANUSHKAA KNITS WORLD. You can now sign in with your email address.
                    </p>
                    <button
                      onClick={() => { setRegSuccess(false); setActiveTab("login"); }}
                      className="btn-gold text-xs px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-md"
                    >
                      Proceed to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Global Register Error Banner */}
                    {regError && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-name" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          id="reg-name"
                          type="text"
                          value={regName}
                          onChange={(e) => { setRegName(e.target.value); setNameErr(""); }}
                          placeholder="Your Full Name"
                          className="w-full px-4 py-3 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/20 transition-all"
                        />
                        {nameErr && <p className="text-[10px] text-rose-500 font-semibold">{nameErr}</p>}
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-mobile" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                          Mobile Number
                        </label>
                        <div className="flex gap-2">
                          <span className="inline-flex items-center px-3 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                            +91
                          </span>
                          <input
                            id="reg-mobile"
                            type="tel"
                            value={regMobile}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setRegMobile(val); setMobileErr("");
                            }}
                            placeholder="9XXXXXXXXX"
                            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/20 transition-all"
                          />
                        </div>
                        {mobileErr && <p className="text-[10px] text-rose-500 font-semibold">{mobileErr}</p>}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-email" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          value={regEmail}
                          onChange={(e) => { setRegEmail(e.target.value); setEmailErr(""); }}
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/20 transition-all"
                        />
                        {emailErr && <p className="text-[10px] text-rose-500 font-semibold">{emailErr}</p>}
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-password" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="reg-password"
                            type={showRegPwd ? "text" : "password"}
                            value={regPassword}
                            onChange={(e) => { setRegPassword(e.target.value); setPwdErr(""); }}
                            placeholder="Min. 8 characters"
                            className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/20 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPwd(prev => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                          >
                            {showRegPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {pwdErr && <p className="text-[10px] text-rose-500 font-semibold">{pwdErr}</p>}

                        {/* Password Strength Meter */}
                        {regPassword && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-zinc-500">Password Strength:</span>
                              <span style={{ color: strength.color }}>{strength.label}</span>
                            </div>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-300"
                                style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-confirm" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            id="reg-confirm"
                            type={showConfirm ? "text" : "password"}
                            value={regConfirm}
                            onChange={(e) => { setRegConfirm(e.target.value); setConfirmErr(""); }}
                            placeholder="Re-enter your password"
                            className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white rounded-xl border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] focus:ring-2 focus:ring-[#C8A24D]/20 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(prev => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                          >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {confirmErr && <p className="text-[10px] text-rose-500 font-semibold">{confirmErr}</p>}
                      </div>

                      {/* Create Account Button */}
                      <button
                        type="submit"
                        disabled={regLoading}
                        className="w-full bg-[#C8A24D] hover:bg-[#b8922d] text-white py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                      >
                        {regLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creating Account…</span>
                          </>
                        ) : (
                          <span>Create Account</span>
                        )}
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center my-4">
                      <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                      <span className="px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                        or register with
                      </span>
                      <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                    </div>

                    {/* Google Registration */}
                    <button
                      type="button"
                      onClick={loginWithGoogle}
                      className="w-full bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </button>

                    {/* Bottom Switcher */}
                    <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="text-[#C8A24D] font-bold hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Security Badge */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#C8A24D]" />
            <span>256-Bit SSL • Secured by Supabase Auth</span>
          </div>

        </div>

      </div>

    </div>
  );
}
