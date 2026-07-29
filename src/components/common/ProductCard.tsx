"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { Heart, Eye, ShoppingBag, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = isInWishlist(product.id);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isExportSurplus && (
            <span className="bg-[#C8A24D] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Surplus 60% OFF
            </span>
          )}
          {product.isNewArrival && !product.isExportSurplus && (
            <span className="bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
              New Season
            </span>
          )}
          {discountPercent > 0 && !product.isExportSurplus && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all z-10 ${
            isLiked
              ? "bg-rose-500 text-white shadow-rose-500/30 scale-110"
              : "bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-200 hover:bg-white hover:text-rose-500"
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
        </button>

        {/* Quick View Hover Bar */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => openQuickView(product)}
            className="flex-1 bg-white/90 dark:bg-zinc-900/90 hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-[#111111] text-zinc-800 dark:text-zinc-100 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
          <button
            onClick={() => addToCart(product)}
            className="bg-[#C8A24D] hover:bg-[#b38e3a] text-white p-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info Box */}
      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
        <div>
          {/* Brand & Gender */}
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            <span>{product.brand}</span>
            <span>{product.gender}</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.id}`} className="block mt-1">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-[#C8A24D] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1.5 py-1">
            {product.colors.map((c) => (
              <span
                key={c.name}
                style={{ backgroundColor: c.hex }}
                className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-700 shadow-xs"
                title={c.name}
              />
            ))}
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-zinc-900 dark:text-white font-serif">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="ml-1 text-zinc-700 dark:text-zinc-300">{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
