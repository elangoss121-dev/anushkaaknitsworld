"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Search, X, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

export const SearchDrawer: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openQuickView } = useShop();
  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ""
    ? []
    : PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(query.toLowerCase())
      );

  const popularSearches = [
    "Polo T-Shirt",
    "Export Surplus",
    "Ribbed Knit",
    "Cotton Romper",
    "Innerwear Trunk",
    "Sweater"
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="relative w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl z-10 p-6 md:p-10"
        >
          <div className="max-w-4xl mx-auto">
            {/* Search Input Bar */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-[#C8A24D]" />
              <input
                type="text"
                autoFocus
                placeholder="Search luxury knitwear, export surplus, polo tees, kids rompers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white pl-14 pr-12 py-4 rounded-2xl text-lg font-medium border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-[#C8A24D] dark:focus:border-[#C8A24D] transition-all shadow-inner"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-14 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="ml-4 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Popular Suggestions */}
            {query.trim() === "" && (
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <Tag className="w-4 h-4 text-[#C8A24D]" /> Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 text-xs font-semibold rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-[#C8A24D] hover:text-white text-zinc-700 dark:text-zinc-300 transition-all border border-zinc-200 dark:border-zinc-700"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Grid */}
            {query.trim() !== "" && (
              <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex justify-between">
                  <span>Search Results ({filteredProducts.length})</span>
                  <Link
                    href={`/shop?search=${encodeURIComponent(query)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="text-[#C8A24D] hover:underline"
                  >
                    View all in Shop →
                  </Link>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <p className="text-base font-serif">No luxury knitwear found for &quot;{query}&quot;</p>
                    <p className="text-xs mt-1 text-zinc-500">Try searching for &apos;Polo&apos;, &apos;Cardigan&apos;, or &apos;Export&apos;</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          openQuickView(p);
                          setIsSearchOpen(false);
                        }}
                        className="group flex gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 cursor-pointer hover:border-[#C8A24D] transition-all"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-20 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex flex-col justify-between py-1 overflow-hidden">
                          <div>
                            <span className="text-[10px] font-bold text-[#C8A24D] uppercase">{p.gender}</span>
                            <h4 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                              {p.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">
                              ₹{p.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-zinc-400 line-through">
                              ₹{p.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
