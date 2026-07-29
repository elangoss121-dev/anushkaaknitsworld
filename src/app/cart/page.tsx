"use client";

import React from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ChevronLeft,
  Truck,
  ShieldCheck
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartGst,
    cartShipping,
    cartTotal
  } = useShop();

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-12 h-12 text-[#C8A24D]" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Explore our organic cotton knitwear, men&apos;s polos, women&apos;s cardigans, and 60% OFF Export Surplus collection.
        </p>
        <Link
          href="/shop"
          className="inline-flex btn-gold px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider items-center gap-2 shadow-xl"
        >
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          Shopping Bag <span className="text-sm font-sans text-zinc-400">({cart.length} items)</span>
        </h1>
        <Link
          href="/shop"
          className="text-xs font-bold uppercase text-[#C8A24D] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Free Shipping Progress Meter */}
      <div className="bg-gradient-to-r from-[#111111] to-zinc-900 text-white p-4 rounded-2xl border border-[#C8A24D]/30 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-2 text-amber-200">
            <Truck className="w-4 h-4 text-[#C8A24D]" />
            {cartSubtotal >= freeShippingThreshold
              ? "🎉 Congratulations! You unlocked FREE Express Shipping!"
              : `Add ₹${(freeShippingThreshold - cartSubtotal).toLocaleString()} more for FREE Delivery!`}
          </span>
          <span>{progressToFreeShipping}%</span>
        </div>
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#C8A24D] h-full transition-all duration-500"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#C8A24D] uppercase">
                    {item.product.brand}
                  </span>
                  <Link href={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm hover:text-[#C8A24D] transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="flex gap-3 text-xs text-zinc-500">
                    <span>Size: <strong className="text-zinc-800 dark:text-zinc-200">{item.selectedSize}</strong></span>
                    <span>Color: <strong className="text-zinc-800 dark:text-zinc-200">{item.selectedColor}</strong></span>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white block sm:hidden">
                    ₹{item.product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                    }
                    className="px-3 py-1 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                    }
                    className="px-3 py-1 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    +
                  </button>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-base font-serif font-bold text-zinc-900 dark:text-white block">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-400">₹{item.product.price} each</span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                  className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
            <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Bag Subtotal</span>
                <span className="font-bold text-zinc-900 dark:text-white">₹{cartSubtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Apparel GST (5%)</span>
                <span>₹{cartGst.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Express Delivery</span>
                <span>{cartShipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${cartShipping}`}</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-zinc-200 dark:border-zinc-800 text-base font-bold text-zinc-900 dark:text-white">
                <span className="font-serif">Grand Total</span>
                <span className="text-2xl font-serif text-[#C8A24D]">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full btn-gold py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
            >
              Proceed to Multi-step Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Guarantees */}
            <div className="space-y-2 text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8A24D]" /> 256-Bit SSL Razorpay Payment Security
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C8A24D]" /> Texvalley Erode Direct Warehouse Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
