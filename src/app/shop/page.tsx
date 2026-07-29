"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/common/ProductCard";
import {
  SlidersHorizontal,
  Grid,
  List,
  X,
  Sparkles,
  Search,
  RotateCcw
} from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [surplusOnly, setSurplusOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(p.category)
      ) {
        return false;
      }
      // Gender filter
      if (selectedGenders.length > 0 && !selectedGenders.includes(p.gender)) {
        return false;
      }
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Size filter
      if (
        selectedSizes.length > 0 &&
        !p.sizes.some((s) => selectedSizes.includes(s))
      ) {
        return false;
      }
      // Max Price filter
      if (p.price > maxPrice) {
        return false;
      }
      // Surplus filter
      if (surplusOnly && !p.isExportSurplus) {
        return false;
      }
      // Search query filter
      if (searchParam && searchParam.trim() !== "") {
        const query = searchParam.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default newest
    });
  }, [
    selectedCategories,
    selectedGenders,
    selectedBrands,
    selectedSizes,
    maxPrice,
    surplusOnly,
    sortBy,
    searchParam
  ]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setMaxPrice(5000);
    setSurplusOnly(false);
  };

  const categoriesList = [
    { id: "t-shirts", name: "T-Shirts & Polos" },
    { id: "shirts", name: "Shirts" },
    { id: "tops", name: "Tops & Cardigans" },
    { id: "hoodies", name: "Hoodies & Jackets" },
    { id: "dresses", name: "Dresses & Kurtis" },
    { id: "trousers", name: "Trousers & Jeans" },
    { id: "export-surplus", name: "Export Surplus (60% OFF)" },
    { id: "innerwear", name: "Innerwear & Nightwear" },
    { id: "kids-wear", name: "Kids Wear" }
  ];

  const brandsList = [
    "Anushka Knits",
    "Texvalley Luxe",
    "European Surplus",
    "Nordic Basics"
  ];
  const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#111111] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden border border-[#C8A24D]/30 shadow-xl">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold text-[#C8A24D] uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Direct Texvalley Erode Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            {categoryParam
              ? categoriesList.find((c) => c.id === categoryParam)?.name || "Luxury Catalog"
              : searchParam
              ? `Results for "${searchParam}"`
              : "Shop Luxury Knitwear"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Explore 100% combed organic cotton tees, sweaters, lounge sets, and verified European export surplus stock at wholesale factory rates.
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters Desktop */}
        <aside className="hidden lg:block space-y-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C8A24D]" /> Filters
            </h3>
            <button
              onClick={resetAllFilters}
              className="text-xs text-[#C8A24D] hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Export Surplus Special Toggle */}
          <div className="bg-[#C8A24D]/10 border border-[#C8A24D]/40 p-3.5 rounded-xl flex items-center justify-between">
            <label htmlFor="surplus-toggle" className="text-xs font-bold text-[#C8A24D] uppercase cursor-pointer">
              Export Surplus Only (60% OFF)
            </label>
            <input
              id="surplus-toggle"
              type="checkbox"
              checked={surplusOnly}
              onChange={(e) => setSurplusOnly(e.target.checked)}
              className="w-4 h-4 accent-[#C8A24D] cursor-pointer"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Categories</h4>
            <div className="space-y-2">
              {categoriesList.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer hover:text-[#C8A24D]">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 accent-[#C8A24D] rounded"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Brand</h4>
            <div className="space-y-2">
              {brandsList.map((b) => (
                <label key={b} className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer hover:text-[#C8A24D]">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                    className="w-4 h-4 accent-[#C8A24D] rounded"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Sizes</h4>
            <div className="flex flex-wrap gap-2">
              {sizesList.map((sz) => (
                <button
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    selectedSizes.includes(sz)
                      ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111]"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between text-xs font-bold uppercase text-zinc-500">
              <span>Max Price</span>
              <span className="text-[#C8A24D]">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C8A24D]"
            />
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Controls Bar */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center gap-2 text-zinc-800 dark:text-white"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#C8A24D]" /> Filters
              </button>

              <span className="text-zinc-500">
                Showing <strong className="text-zinc-900 dark:text-white">{filteredProducts.length}</strong> items
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* View Switcher */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white dark:bg-zinc-700 shadow-xs text-[#C8A24D]" : "text-zinc-400"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white dark:bg-zinc-700 shadow-xs text-[#C8A24D]" : "text-zinc-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges Bar */}
          {(selectedCategories.length > 0 ||
            selectedBrands.length > 0 ||
            selectedSizes.length > 0 ||
            surplusOnly) && (
            <div className="flex flex-wrap gap-2 items-center bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-zinc-400">Active Filters:</span>
              {selectedCategories.map((c) => (
                <span key={c} className="bg-white dark:bg-zinc-700 text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1">
                  {c} <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(c)} />
                </span>
              ))}
              {surplusOnly && (
                <span className="bg-[#C8A24D] text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  Export Surplus Only <X className="w-3 h-3 cursor-pointer" onClick={() => setSurplusOnly(false)} />
                </span>
              )}
            </div>
          )}

          {/* Product Items Display */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-16 text-center border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                No items match your selected filters
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try clearing some filters or lowering the price range to explore our full Texvalley catalog.
              </p>
              <button
                onClick={resetAllFilters}
                className="btn-gold px-6 py-2.5 rounded-xl font-bold text-xs uppercase"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
