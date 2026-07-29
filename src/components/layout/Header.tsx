"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { STORE_INFO } from "@/data/store-info";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronDown,
  Sparkles,
  LayoutDashboard
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    setIsSearchOpen,
    role,
    setRole,
    currency,
    setCurrency,
    user,
    logoutUser
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
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
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white text-xs py-2 px-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="hidden lg:flex items-center gap-4 text-zinc-300">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#C8A24D]" />
            Texvalley Global Market, Erode
          </span>
          <span>|</span>
          <a href="tel:9442707630" className="flex items-center gap-1 hover:text-[#C8A24D] transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#C8A24D]" />
            +91 9442707630
          </a>
        </div>

        {/* Center Live Ticker */}
        <div className="flex-1 text-center font-medium tracking-wide text-amber-200/90 truncate px-2 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A24D] animate-spin" />
          <span>FESTIVE SPECIAL: 15% OFF on Export Surplus | Code: EXPORT15</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-zinc-700">
            <span className="text-zinc-400">View:</span>
            <button
              onClick={() => setRole(role === "Customer" ? "Admin" : "Customer")}
              className="text-[#C8A24D] hover:underline font-bold flex items-center gap-1"
            >
              {role === "Customer" ? "Storefront" : "Shopify Admin"}
              <LayoutDashboard className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdown(!currencyDropdown)}
              className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span>{currency.code} ({currency.symbol})</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {currencyDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-[#111111] border border-zinc-800 rounded-lg shadow-xl py-1 z-50 w-28">
                {STORE_INFO.currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-[#C8A24D] flex justify-between"
                  >
                    <span>{c.code}</span>
                    <span>{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

          {/* Desktop Mega Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-xs uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-2"
            >
              Home
            </Link>

            <Link
              href="/shop?category=t-shirts"
              className="text-xs uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-2"
            >
              T-Shirts
            </Link>

            <Link
              href="/shop?category=shirts"
              className="text-xs uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-2"
            >
              Shirts
            </Link>

            <Link
              href="/shop?category=tops"
              className="text-xs uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-2"
            >
              Tops
            </Link>

            <Link
              href="/shop?category=hoodies"
              className="text-xs uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-2"
            >
              Hoodies
            </Link>

            {/* Export Surplus Flagship Badge */}
            <Link
              href="/shop?category=export-surplus"
              className="relative text-xs uppercase font-bold tracking-widest text-zinc-900 dark:text-white hover:text-[#C8A24D] transition-colors py-2 flex items-center gap-1.5"
            >
              <span>Export Surplus</span>
              <span className="bg-[#C8A24D] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                60% OFF
              </span>
            </Link>

            <Link
              href="/shop?category=kids-wear"
              className="text-xs uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-2"
            >
              Kids Wear
            </Link>

            <Link
              href="/shop?category=innerwear"
              className="text-xs uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-2"
            >
              Innerwear
            </Link>

            {role === "Admin" && (
              <Link
                href="/admin"
                className="bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs uppercase font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#C8A24D]"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#C8A24D]" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] transition-colors"
              title="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>



            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="relative p-2 text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8A24D] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="p-2 text-zinc-800 dark:text-zinc-200 hover:text-[#C8A24D] transition-colors flex items-center gap-1"
              >
                <User className="w-5 h-5" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-2 z-50 text-sm">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserDropdown(false)}
                        className="block px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        My Account & Orders
                      </Link>
                      <Link
                        href="/account?tab=wallet"
                        onClick={() => setUserDropdown(false)}
                        className="block px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Store Wallet (₹{user.walletBalance})
                      </Link>
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setUserDropdown(false)}
                        className="block px-4 py-2.5 font-bold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 text-center"
                      >
                        Login / Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-6 space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-zinc-900 dark:text-white"
            >
              Home
            </Link>
            <Link
              href="/shop?category=t-shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-zinc-900 dark:text-white"
            >
              T-Shirts
            </Link>
            <Link
              href="/shop?category=shirts"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-zinc-900 dark:text-white"
            >
              Shirts
            </Link>
            <Link
              href="/shop?category=tops"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-zinc-900 dark:text-white"
            >
              Tops
            </Link>
            <Link
              href="/shop?category=hoodies"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-zinc-900 dark:text-white"
            >
              Hoodies
            </Link>
            <Link
              href="/shop?category=kids-wear"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-zinc-900 dark:text-white"
            >
              Kids Wear
            </Link>
            <Link
              href="/shop?category=export-surplus"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-[#C8A24D] flex justify-between items-center"
            >
              <span>Export Surplus</span>
              <span className="bg-[#C8A24D] text-white text-[10px] px-2 py-0.5 rounded-full">
                60% OFF
              </span>
            </Link>
            <Link
              href="/shop?category=innerwear"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-zinc-900 dark:text-white"
            >
              Innerwear
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-sm uppercase text-amber-500"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
