"use client";

import React, { useState } from "react";
import Link from "next/link";
import { STORE_INFO } from "@/data/store-info";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/common/ProductCard";
import {
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"trending" | "new" | "bestseller" | "surplus">("trending");

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeTab === "trending") return p.isTrending;
    if (activeTab === "new") return p.isNewArrival;
    if (activeTab === "bestseller") return p.isBestSeller;
    if (activeTab === "surplus") return p.isExportSurplus;
    return true;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO BANNER SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#111111] text-white">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Fashion Knitwear"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-12">
          {/* Gold Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A24D]/20 border border-[#C8A24D]/50 text-[#C8A24D] text-xs font-bold uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#C8A24D]" />
            Texvalley Erode Flagship • Export Surplus Hub
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none drop-shadow-2xl"
          >
            Premium Fashion <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#C8A24D]">
              For Every Wardrobe
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed"
          >
            Discover organic combed cotton knitwear, tailored polos, luxury cardigans, and authentic European export surplus stock direct from Texvalley Erode.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/shop"
              className="btn-gold px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop?category=export-surplus"
              className="px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
            >
              Export Surplus 60% OFF
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10 text-xs font-semibold text-zinc-400">
            <div className="flex flex-col items-center">
              <span className="text-white text-lg font-bold">100%</span>
              <span>Combed Organic Cotton</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-lg font-bold">60% OFF</span>
              <span>Export Surplus Deals</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-lg font-bold">Texvalley</span>
              <span>Erode Market Flagship</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white text-lg font-bold">24-48 Hr</span>
              <span>Express Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#C8A24D] uppercase tracking-widest">
            Curated Collections
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white">
            Explore Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STORE_INFO.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col justify-end p-6"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 space-y-1 text-white">
                {cat.isSpecial && (
                  <span className="bg-[#C8A24D] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Hot Surplus
                  </span>
                )}
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#C8A24D] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2">{cat.description}</p>
                <span className="text-xs font-bold text-[#C8A24D] uppercase tracking-wider pt-2 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore {cat.itemCount}+ Items →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING PRODUCTS & NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold text-[#C8A24D] uppercase tracking-widest">
              Signature Creations
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
              Trending & Best Sellers
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "trending", label: "Trending" },
              { id: "new", label: "New Arrivals" },
              { id: "bestseller", label: "Best Sellers" },
              { id: "surplus", label: "Export Surplus 60% OFF" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-md"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE ANUSHKAA KNITS WORLD */}
      <section className="bg-zinc-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#C8A24D] uppercase tracking-widest">
              The Texvalley Advantage
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold">
              Why Choose ANUSHKAA KNITS WORLD?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700 space-y-3">
              <Award className="w-10 h-10 text-[#C8A24D]" />
              <h3 className="text-lg font-bold text-white font-serif">100% Premium Quality</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Made with long-staple Supima & GOTS certified organic combed cotton knit in Erode.
              </p>
            </div>

            <div className="bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700 space-y-3">
              <Sparkles className="w-10 h-10 text-[#C8A24D]" />
              <h3 className="text-lg font-bold text-white font-serif">Direct Factory Prices</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No middleman markup. Enjoy authentic wholesale pricing direct from our Texvalley flagship store.
              </p>
            </div>

            <div className="bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700 space-y-3">
              <Truck className="w-10 h-10 text-[#C8A24D]" />
              <h3 className="text-lg font-bold text-white font-serif">Express Dispatch</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                24-hour dispatch via BlueDart & DTDC with live SMS and WhatsApp tracking.
              </p>
            </div>

            <div className="bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700 space-y-3">
              <ShieldCheck className="w-10 h-10 text-[#C8A24D]" />
              <h3 className="text-lg font-bold text-white font-serif">Verified Export Surplus</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                100% original European brand overstock garments with certified stitch durability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#C8A24D] uppercase tracking-widest">
            Texvalley Verified Reviews
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white">
            Loved By Over 10,000+ Buyers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Rajesh Kumar",
              role: "Verified Buyer (Chennai)",
              comment: "The Pima polo tshirt is incredible! Quality matches my imported Tommy/Polo shirts at 1/4th the price. Texvalley Erode delivers standard perfection.",
              rating: 5
            },
            {
              name: "Deepika Sundaram",
              role: "Verified Buyer (Coimbatore)",
              comment: "Bought the rib knit cardigan for women and export surplus hoodies for my kids. Extremely soft cotton fabric and fast delivery in 2 days!",
              rating: 5
            },
            {
              name: "Vikram Sengottaiyan",
              role: "Wholesale Partner (Bangalore)",
              comment: "ANUSHKAA KNITS WORLD is my go-to for original export surplus. The stitching, GSM density, and colors stay top notch even after multiple washes.",
              rating: 5
            }
          ].map((rev, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4"
            >
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                &quot;{rev.comment}&quot;
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">{rev.name}</h4>
                  <span className="text-[10px] text-zinc-400">{rev.role}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STORE LOCATION & GOOGLE MAPS SECTION */}
      <section id="texvalley-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
          {/* Map Info Box */}
          <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#C8A24D] uppercase tracking-widest">
                Visit Our Flagship Store
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
                Texvalley Erode Outlet
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Experience our full range of luxury knitwear, export surplus stock, and wholesale fabric samples in person at Asia&apos;s largest textile market complex.
              </p>

              {/* Address details */}
              <div className="bg-zinc-50 dark:bg-zinc-800/80 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C8A24D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-zinc-900 dark:text-white">Store Address:</strong>
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {STORE_INFO.address.fullAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#C8A24D] shrink-0" />
                  <div>
                    <strong className="block text-zinc-900 dark:text-white">Phone Hotline:</strong>
                    <a href={`tel:${STORE_INFO.contact.phone}`} className="text-[#C8A24D] font-bold hover:underline">
                      {STORE_INFO.contact.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <strong className="block text-zinc-900 dark:text-white">WhatsApp Orders:</strong>
                    <a
                      href={`https://wa.me/91${STORE_INFO.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 font-bold hover:underline"
                    >
                      {STORE_INFO.contact.whatsappDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <a
                href={`https://wa.me/91${STORE_INFO.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
              <a
                href={`tel:${STORE_INFO.contact.phone}`}
                className="flex-1 bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call Store
              </a>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="relative min-h-[350px] lg:min-h-[500px] w-full bg-zinc-200 dark:bg-zinc-800">
            <iframe
              title="Texvalley Erode Location"
              src={STORE_INFO.address.mapEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
