"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STORE_INFO } from "@/data/store-info";
import { MapPin, Phone, MessageCircle, Send, ShieldCheck, Truck, RefreshCw, Award, Globe, Share2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const { showToast } = useShop();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    showToast("🎉 Thank you for subscribing! Check your email for code 'ANUSHKA10'");
    setEmail("");
  };

  return (
    <footer className="bg-[#111111] text-zinc-300 pt-16 pb-8 border-t border-zinc-800 font-sans">
      {/* Brand Value Props Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-[#C8A24D]/30 flex items-center justify-center text-[#C8A24D]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Texvalley Quality</h4>
              <p className="text-xs text-zinc-400">100% Combed Organic Knitwear</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-[#C8A24D]/30 flex items-center justify-center text-[#C8A24D]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Express Shipping</h4>
              <p className="text-xs text-zinc-400">Free delivery on orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-[#C8A24D]/30 flex items-center justify-center text-[#C8A24D]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Returns</h4>
              <p className="text-xs text-zinc-400">7 Days Doorstep Replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-[#C8A24D]/30 flex items-center justify-center text-[#C8A24D]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Export Surplus</h4>
              <p className="text-xs text-zinc-400">Authentic International Overstock</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Store Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black text-white tracking-widest">
                ANUSHKAA
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8A24D]">
                KNITS WORLD • TEXVALLEY ERODE
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed pr-6">
              ANUSHKAA KNITS WORLD is Erode&apos;s premier destination for high-grade organic knitwear, clothing types, kids wear, innerwear, and authentic international export surplus clothing.
            </p>

            {/* Address Box */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A24D] shrink-0 mt-0.5" />
                <span>{STORE_INFO.address.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A24D] shrink-0" />
                <span>Hotline: <a href={`tel:${STORE_INFO.contact.phone}`} className="text-white hover:underline">{STORE_INFO.contact.phoneDisplay}</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>WhatsApp: <a href={`https://wa.me/91${STORE_INFO.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{STORE_INFO.contact.whatsappDisplay}</a></span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a href={STORE_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#C8A24D] text-white flex items-center justify-center transition-colors" title="Instagram">
                <Globe className="w-4 h-4" />
              </a>
              <a href={STORE_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#C8A24D] text-white flex items-center justify-center transition-colors" title="Facebook">
                <Share2 className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/91${STORE_INFO.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#C8A24D] text-white flex items-center justify-center transition-colors" title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-white text-base tracking-wider border-b border-[#C8A24D]/30 pb-2">
              Collections
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/shop?category=t-shirts" className="hover:text-[#C8A24D] transition-colors">
                  T-Shirts & Polos
                </Link>
              </li>
              <li>
                <Link href="/shop?category=shirts" className="hover:text-[#C8A24D] transition-colors">
                  Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tops" className="hover:text-[#C8A24D] transition-colors">
                  Tops & Cardigans
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hoodies" className="hover:text-[#C8A24D] transition-colors">
                  Hoodies & Jackets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=export-surplus" className="text-[#C8A24D] font-bold hover:underline">
                  Export Surplus (60% OFF)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids-wear" className="hover:text-[#C8A24D] transition-colors">
                  Kids Wear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=innerwear" className="hover:text-[#C8A24D] transition-colors">
                  Innerwear & Nightwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Policies & Help */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-white text-base tracking-wider border-b border-[#C8A24D]/30 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/account?tab=orders" className="hover:text-[#C8A24D] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account?tab=tickets" className="hover:text-[#C8A24D] transition-colors">
                  Help & Support Tickets
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#C8A24D] transition-colors">
                  Size Guide & Fit Chart
                </Link>
              </li>
              <li>
                <a href="#texvalley-map" className="hover:text-[#C8A24D] transition-colors">
                  Texvalley Store Location
                </a>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#C8A24D] transition-colors">
                  Shipping & Return Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#C8A24D] transition-colors">
                  Terms & Conditions
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: VIP Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-white text-base tracking-wider border-b border-[#C8A24D]/30 pb-2">
              VIP Privileges
            </h4>
            <p className="text-xs text-zinc-400">
              Subscribe to unlock 10% OFF your first order and receive direct alerts for new Export Surplus arrivals.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 text-white placeholder-zinc-500 text-xs px-3.5 py-3 rounded-lg border border-zinc-800 focus:outline-none focus:border-[#C8A24D]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-[#C8A24D] hover:bg-[#b38e3a] text-white px-3 rounded-md flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            <span className="text-[10px] text-zinc-500 block">
              We respect your privacy. Unsubscribe anytime.
            </span>
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} ANUSHKAA KNITS WORLD. All Rights Reserved. Texvalley Global Market, Erode, Tamil Nadu.</p>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Secured by Razorpay</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-zinc-900 text-[10px] font-bold text-zinc-300 rounded border border-zinc-800">UPI</span>
              <span className="px-2 py-1 bg-zinc-900 text-[10px] font-bold text-zinc-300 rounded border border-zinc-800">VISA</span>
              <span className="px-2 py-1 bg-zinc-900 text-[10px] font-bold text-zinc-300 rounded border border-zinc-800">Mastercard</span>
              <span className="px-2 py-1 bg-zinc-900 text-[10px] font-bold text-zinc-300 rounded border border-zinc-800">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
