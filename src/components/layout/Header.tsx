"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const { cart, user } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full h-[75px] bg-white dark:bg-[#111111] border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo (Left) */}
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-serif text-xl sm:text-2xl font-black tracking-widest text-[#111111] dark:text-white group-hover:text-[#C8A24D] transition-colors">
            ANUSHKAA
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8A24D] -mt-1">
            KNITS WORLD • TEXVALLEY
          </span>
        </Link>

        {/* Desktop Navigation Links (Right) */}
        <nav className="hidden lg:flex items-center space-x-10">
          <Link
            href="/"
            className="relative py-1 text-xs uppercase font-bold tracking-widest text-zinc-900 dark:text-zinc-100 hover:text-[#C8A24D] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C8A24D] after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="relative py-1 text-xs uppercase font-bold tracking-widest text-zinc-900 dark:text-zinc-100 hover:text-[#C8A24D] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C8A24D] after:transition-all after:duration-300 hover:after:w-full"
          >
            Products
          </Link>

          <Link
            href="/cart"
            className="relative py-1 text-xs uppercase font-bold tracking-widest text-zinc-900 dark:text-zinc-100 hover:text-[#C8A24D] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C8A24D] after:transition-all after:duration-300 hover:after:w-full flex items-center gap-1.5"
          >
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-[#C8A24D] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            )}
          </Link>

          <Link
            href={user ? "/account" : "/login"}
            className="relative py-1 text-xs uppercase font-bold tracking-widest text-zinc-900 dark:text-zinc-100 hover:text-[#C8A24D] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C8A24D] after:transition-all after:duration-300 hover:after:w-full"
          >
            {user ? "My Account" : "Login"}
          </Link>
        </nav>

        {/* Mobile Right Controls */}
        <div className="flex items-center space-x-3 lg:hidden">
          <Link
            href="/cart"
            className="relative p-2 text-zinc-900 dark:text-white"
            title="Cart"
          >
            <span className="text-xs uppercase font-bold tracking-widest">Cart</span>
            {totalCartCount > 0 && (
              <span className="ml-1 bg-[#C8A24D] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-900 dark:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#111111] border-b border-zinc-200 dark:border-zinc-800 px-6 py-6 space-y-4 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-xs uppercase tracking-widest text-zinc-900 dark:text-white hover:text-[#C8A24D]"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-xs uppercase tracking-widest text-zinc-900 dark:text-white hover:text-[#C8A24D]"
          >
            Products
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-xs uppercase tracking-widest text-zinc-900 dark:text-white hover:text-[#C8A24D] flex items-center justify-between"
          >
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-[#C8A24D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            )}
          </Link>
          <Link
            href={user ? "/account" : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold text-xs uppercase tracking-widest text-zinc-900 dark:text-white hover:text-[#C8A24D]"
          >
            {user ? "My Account" : "Login"}
          </Link>
        </div>
      )}
    </header>
  );
};

