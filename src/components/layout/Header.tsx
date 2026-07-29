"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    setIsSearchOpen,
    role,
    user,
    logoutUser
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Main Luxury Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "glass-nav shadow-lg py-3 border-b border-zinc-200/80 dark:border-zinc-800/80"
            : "bg-white/95 dark:bg-[#111111]/95 py-4 border-b border-zinc-100 dark:border-zinc-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-800 dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex flex-col items-center lg:items-start group">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-[#111111] dark:text-white group-hover:text-[#C8A24D] transition-colors">
              ANUSHKAA
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8A24D] -mt-1">
              KNITS WORLD • TEXVALLEY
            </span>
          </Link>

          {/* Simplified Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link href="/" className="text-sm uppercase font-medium tracking-widest text-zinc-800 hover:text-[#C8A24D] transition-all py-2">
              Home
            </Link>

            <Link href="/shop" className="text-sm uppercase font-medium tracking-widest text-zinc-800 hover:text-[#C8A24D] transition-all py-2">
              Products
            </Link>

            <Link href="/cart" className="text-sm uppercase font-medium tracking-widest text-zinc-800 hover:text-[#C8A24D] transition-all py-2 flex items-center gap-2">
              Cart
            </Link>

            {/* Login / My Account */}
            <Link href={user ? "/account" : "/login"} className="text-sm uppercase font-medium tracking-widest text-zinc-800 hover:text-[#C8A24D] transition-all py-2">
              {user ? "My Account" : "Login"}
            </Link>
          </div>

          {/* Simplified Right Actions (mobile + desktop) */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-zinc-800 hover:text-[#C8A24D] transition-colors" title="Shopping Cart">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A24D] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* Login / Account */}
            <div>
              <Link href={user ? "/account" : "/login"} className="text-sm font-medium text-zinc-800 hover:text-[#C8A24D] transition-all">
                {user ? "My Account" : "Login"}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer (simplified) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-6 space-y-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-sm uppercase text-zinc-900 dark:text-white">Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-sm uppercase text-zinc-900 dark:text-white">Products</Link>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="block font-bold text-sm uppercase text-zinc-900 dark:text-white">Cart</Link>
            <Link href={user ? "/account" : "/login"} onClick={() => setMobileMenuOpen(false)} className="block font-bold text-sm uppercase text-zinc-900 dark:text-white">{user ? 'My Account' : 'Login'}</Link>
          </div>
        )}
      </nav>
    </header>
  );
};
