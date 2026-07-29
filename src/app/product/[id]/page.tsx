"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/common/ProductCard";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  Check,
  Ruler,
  Share2,
  Sparkles,
  MessageCircle,
  Plus
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useShop();

  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [selectedImg, setSelectedImg] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState<string>("638102");
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(true);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"specs" | "care" | "reviews" | "shipping">("specs");

  const isLiked = isInWishlist(product.id);

  const bundleProduct = PRODUCTS.find(
    (p) => product.frequentlyBoughtTogetherIds?.includes(p.id)
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!");
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeChecked(true);
      showToast(`Pincode ${pincode} verified for express delivery`);
    }
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Top Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl group">
            <img
              src={product.images[selectedImg] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {product.isExportSurplus && (
              <span className="absolute top-4 left-4 bg-[#C8A24D] text-white text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> European Export Surplus 60% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(idx)}
                className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImg === idx
                    ? "border-[#C8A24D] scale-105 shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Information */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Brand */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-[#C8A24D]">{product.brand}</span>
                <span>•</span>
                <span>{product.gender}</span>
              </div>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Star Rating */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-bold ml-1 text-zinc-900 dark:text-white">
                  {product.rating}
                </span>
              </div>
              <span className="text-zinc-400">|</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {product.reviewCount} Verified Buyer Reviews
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white font-serif">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-lg text-zinc-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-emerald-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                Save {discountPercent}%
              </span>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Selected Color: <strong className="text-zinc-900 dark:text-white">{selectedColor}</strong>
              </label>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    className={`w-9 h-9 rounded-full border-2 transition-transform relative flex items-center justify-center ${
                      selectedColor === c.name
                        ? "border-[#C8A24D] scale-110 shadow-lg"
                        : "border-zinc-300 dark:border-zinc-700 hover:scale-105"
                    }`}
                  >
                    {selectedColor === c.name && (
                      <Check className="w-4 h-4 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-zinc-500">
                  Select Size: <strong className="text-zinc-900 dark:text-white">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[#C8A24D] hover:underline flex items-center gap-1 font-bold"
                >
                  <Ruler className="w-3.5 h-3.5" /> Texvalley Fit Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-5 py-2.5 text-sm font-bold rounded-xl border transition-all ${
                      selectedSize === s
                        ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] shadow-md"
                        : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  +
                </button>
              </div>

              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                In Stock ({product.stock} units available at Texvalley Store)
              </span>
            </div>

            {/* Delivery Checker Box */}
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
              <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C8A24D]" /> Check Delivery Estimate
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#C8A24D]"
                  placeholder="Enter PIN code"
                />
                <button
                  type="submit"
                  className="bg-zinc-900 dark:bg-zinc-700 text-white px-4 py-2 rounded-xl font-bold uppercase text-[10px]"
                >
                  Check
                </button>
              </form>
              {pincodeChecked && (
                <p className="text-emerald-600 font-semibold text-[11px] pt-1">
                  ✓ Express Air Shipping available to PIN {pincode}. Guaranteed delivery within 3 days.
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                className="flex-1 btn-gold py-4 px-8 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Shopping Bag
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-xl border transition-colors flex items-center justify-center ${
                  isLiked
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 transition-colors"
                title="Share Product"
              >
                <Share2 className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>

            <a
              href={`https://wa.me/919566396667?text=${encodeURIComponent(
                `Hello ANUSHKAA KNITS WORLD, I have a question about product: ${product.name} (SKU: ${product.sku})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Ask Store Expert on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* FREQUENTLY BOUGHT TOGETHER BUNDLE BOX */}
      {bundleProduct && (
        <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A24D]">
            <Sparkles className="w-4 h-4" /> Frequently Bought Together
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <Plus className="w-6 h-6 text-zinc-400 shrink-0" />
              <div className="w-20 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                <img src={bundleProduct.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex-1 space-y-1 text-center md:text-left">
              <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                {product.name} + {bundleProduct.name}
              </h4>
              <p className="text-xs text-zinc-400">
                Bundle Total: <strong className="text-zinc-900 dark:text-white text-sm">₹{(product.price + bundleProduct.price - 200).toLocaleString()}</strong>{" "}
                <span className="text-emerald-600 font-bold">(Save Extra ₹200)</span>
              </p>
            </div>

            <button
              onClick={() => {
                addToCart(product);
                addToCart(bundleProduct);
                showToast("Added Bundle items to Shopping Bag with discount!");
              }}
              className="btn-gold px-6 py-3 rounded-xl font-bold text-xs uppercase shadow-md shrink-0"
            >
              Add Bundle to Bag
            </button>
          </div>
        </section>
      )}

      {/* SPECIFICATIONS & REVIEWS TABS */}
      <section className="space-y-6">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-8 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          {[
            { id: "specs", label: "Product Specifications" },
            { id: "care", label: "Fabric & Care Instructions" },
            { id: "reviews", label: `Customer Reviews (${product.reviews.length})` },
            { id: "shipping", label: "Shipping & Return Policy" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-4 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-[#C8A24D] text-[#C8A24D]"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-600 dark:text-zinc-300">
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">Material & Knit</span>
                <p>{product.fabricSpecs.material} • {product.fabricSpecs.knitType}</p>
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">GSM Weight</span>
                <p>{product.fabricSpecs.weight}</p>
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">Manufacturing Origin</span>
                <p>{product.fabricSpecs.origin}</p>
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">Barcode & SKU</span>
                <p>{product.barcode} | {product.sku}</p>
              </div>
            </div>
          )}

          {activeTab === "care" && (
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {product.fabricSpecs.careInstructions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <p className="text-sm text-zinc-500">No reviews yet for this product. Be the first to review!</p>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-zinc-100 dark:border-zinc-800 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-white text-sm">{rev.userName}</span>
                      <span className="text-xs text-zinc-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-500 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              <p>• All orders are packed directly at Texvalley Global Market Erode and dispatched within 24 hours.</p>
              <p>• Free Express Shipping across India on orders above ₹999.</p>
              <p>• Hassle-free 7-day doorstep replacement and returns.</p>
            </div>
          )}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-white">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-lg w-full space-y-4 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-lg">Texvalley Apparel Size Guide (Inches)</h3>
              <button onClick={() => setShowSizeGuide(false)} className="font-bold text-lg">
                ×
              </button>
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Length</th>
                  <th className="py-2">Shoulder</th>
                </tr>
              </thead>
              <tbody>
                {product.sizeGuide.map((sg) => (
                  <tr key={sg.size} className="border-b border-zinc-100 dark:border-zinc-800/60">
                    <td className="py-2.5 font-bold text-[#C8A24D]">{sg.size}</td>
                    <td className="py-2.5">{sg.chest}</td>
                    <td className="py-2.5">{sg.length}</td>
                    <td className="py-2.5">{sg.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-2.5 rounded-xl font-bold text-xs uppercase"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
