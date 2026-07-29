"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const QuickViewModal: React.FC = () => {
  const { isQuickViewOpen, quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useShop();

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      queueMicrotask(() => {
        setSelectedColor(quickViewProduct.colors[0]?.name || "");
        setSelectedSize(quickViewProduct.sizes[0] || "M");
        setActiveImgIndex(0);
        setQuantity(1);
      });
    }
  }, [quickViewProduct]);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const isLiked = isInWishlist(quickViewProduct.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-10 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-6 lg:p-8"
        >
          {/* Close Button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                <img
                  src={quickViewProduct.images[activeImgIndex] || quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {quickViewProduct.isExportSurplus && (
                  <span className="absolute top-3 left-3 bg-[#C8A24D] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Export Surplus 60% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImgIndex === idx ? "border-[#C8A24D] scale-105" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A24D]">
                  <span>{quickViewProduct.brand}</span>
                  <span>•</span>
                  <span>{quickViewProduct.gender}</span>
                </div>

                <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mt-1">
                  {quickViewProduct.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="font-bold ml-1">{quickViewProduct.rating}</span>
                  </div>
                  <span>({quickViewProduct.reviewCount} verified reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl font-bold text-[#111111] dark:text-white font-serif">
                    ₹{quickViewProduct.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-zinc-400 line-through">
                    ₹{quickViewProduct.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                    Save {Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)}%
                  </span>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-4 leading-relaxed">
                  {quickViewProduct.shortDescription}
                </p>

                {/* Color Selector */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Color: <span className="text-zinc-900 dark:text-white">{selectedColor}</span>
                  </label>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform relative flex items-center justify-center ${
                          selectedColor === c.name ? "border-[#C8A24D] scale-110 shadow-md" : "border-zinc-300 dark:border-zinc-700 hover:scale-105"
                        }`}
                      >
                        {selectedColor === c.name && <Check className="w-4 h-4 text-white mix-blend-difference" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <span>Size: <span className="text-zinc-900 dark:text-white">{selectedSize}</span></span>
                    <span className="text-[#C8A24D] underline cursor-pointer">Texvalley Fit Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                          selectedSize === s
                            ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111]"
                            : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-5 flex items-center gap-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Qty:
                  </label>
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-lg font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-semibold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-lg font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">
                    In Stock ({quickViewProduct.stock} left)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
                      closeQuickView();
                    }}
                    className="flex-1 btn-gold py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" /> Add to Bag
                  </button>

                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                      isLiked
                        ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800"
                        : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-600" : ""}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${quickViewProduct.id}`}
                  onClick={closeQuickView}
                  className="block text-center text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-[#C8A24D] dark:hover:text-[#C8A24D] transition-colors py-1"
                >
                  View Full Product Details & Specs →
                </Link>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C8A24D]" /> Express Delivery across India
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C8A24D]" /> 100% Genuine Texvalley Knit
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
