"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/common/ProductCard";
import { PRODUCTS } from "@/data/products";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Wallet,
  Award,
  Ticket,
  Lock,
  LogOut,
  ChevronRight,
  Printer,
  CheckCircle2,
  Clock,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { user, orders, wishlist, logoutUser, loginUser, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "wishlist" | "addresses" | "wallet" | "tickets">("overview");

  // Login simulation state
  const [emailInput, setEmailInput] = useState("siva.texvalley@gmail.com");
  const [nameInput, setNameInput] = useState("Sivakumar P.");

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">
              Customer Account Portal
            </h1>
            <p className="text-xs text-zinc-500">
              Sign in to track Texvalley orders, manage addresses, and access VIP reward points.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginUser(emailInput, nameInput);
            }}
            className="space-y-4 text-xs font-semibold"
          >
            <div className="space-y-1">
              <label className="text-zinc-500">Full Name</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8A24D]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500">Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8A24D]"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-gold py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg"
            >
              Sign In to Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header Greeting */}
      <div className="bg-[#111111] text-white p-8 rounded-3xl border border-[#C8A24D]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#C8A24D] text-white flex items-center justify-center text-2xl font-bold font-serif shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">{user.name}</h1>
            <p className="text-xs text-zinc-400">{user.email} • {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 px-4 py-2 rounded-xl text-center border border-zinc-700">
            <span className="text-xs text-zinc-400 block font-bold">Store Wallet</span>
            <span className="text-lg font-bold text-emerald-400">₹{user.walletBalance}</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1 text-xs font-bold uppercase tracking-wider h-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
              activeTab === "overview" ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
            }`}
          >
            <span className="flex items-center gap-2.5"><User className="w-4 h-4" /> Account Overview</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
              activeTab === "orders" ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
            }`}
          >
            <span className="flex items-center gap-2.5"><ShoppingBag className="w-4 h-4" /> My Orders ({orders.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
              activeTab === "wishlist" ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
            }`}
          >
            <span className="flex items-center gap-2.5"><Heart className="w-4 h-4" /> My Wishlist ({wishlist.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
              activeTab === "addresses" ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
            }`}
          >
            <span className="flex items-center gap-2.5"><MapPin className="w-4 h-4" /> Saved Addresses</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
              activeTab === "wallet" ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
            }`}
          >
            <span className="flex items-center gap-2.5"><Wallet className="w-4 h-4" /> Wallet & Rewards</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab("tickets")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
              activeTab === "tickets" ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
            }`}
          >
            <span className="flex items-center gap-2.5"><Ticket className="w-4 h-4" /> Support Tickets</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={logoutUser}
            className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors pt-4 border-t border-zinc-100 dark:border-zinc-800"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </aside>

        {/* Main Content Pane */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
                  <span className="text-xs text-zinc-400 uppercase font-bold">Total Orders</span>
                  <p className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">{orders.length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
                  <span className="text-xs text-zinc-400 uppercase font-bold">Wishlist Saved</span>
                  <p className="text-2xl font-serif font-bold text-zinc-900 dark:text-white">{wishlist.length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
                  <span className="text-xs text-zinc-400 uppercase font-bold">Default Delivery</span>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">Erode, Tamil Nadu (638102)</p>
                </div>
              </div>

              {/* Recent Order Preview */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                  Recent Orders
                </h3>
                {orders.map((o) => (
                  <div key={o.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white block">Order {o.id}</span>
                      <span className="text-zinc-400">{o.date} • {o.items.length} items</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full">
                        {o.status}
                      </span>
                      <Link href={`/order-success/${o.id}`} className="text-[#C8A24D] font-bold hover:underline">
                        View Invoice →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === "orders" && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">
                Order History & Status
              </h3>
              {orders.map((o) => (
                <div key={o.id} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs">
                    <div>
                      <span className="font-bold text-base text-zinc-900 dark:text-white">Order {o.id}</span>
                      <span className="text-zinc-400 block">Placed on {o.date}</span>
                    </div>
                    <div className="pt-2 sm:pt-0 flex items-center gap-2">
                      <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-full text-xs">
                        {o.status}
                      </span>
                      <Link
                        href={`/order-success/${o.id}`}
                        className="btn-gold px-4 py-1.5 rounded-lg font-bold text-[11px] uppercase flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Invoice
                      </Link>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center text-xs">
                        <img src={item.product.images[0]} alt="" className="w-12 h-14 object-cover rounded-lg shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-bold text-zinc-900 dark:text-white">{item.product.name}</h4>
                          <p className="text-zinc-400">Qty: {item.quantity} | Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">
                My Saved Wishlist ({wishlistProducts.length})
              </h3>
              {wishlistProducts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-12 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                  <p>Your wishlist is empty. Tap the heart icon on products to save them!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">
                  Saved Delivery Addresses
                </h3>
                <button className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              <div className="p-4 rounded-xl border border-[#C8A24D] bg-[#C8A24D]/5 space-y-2 text-xs">
                <span className="bg-[#C8A24D] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  Default Address
                </span>
                <h4 className="font-bold text-zinc-900 dark:text-white">{user.name}</h4>
                <p className="text-zinc-600 dark:text-zinc-300">
                  55, Ground Floor, Global Market, Texvalley, NH47, Gangapuram, Chithode, Erode – 638102
                </p>
                <p className="text-zinc-500">Phone: {user.phone}</p>
              </div>
            </div>
          )}

          {/* TAB 5: WALLET */}
          {activeTab === "wallet" && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-3">
                Store Wallet & Credit Balance
              </h3>

              <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-emerald-500/40 space-y-2 max-w-md">
                <Wallet className="w-8 h-8 text-emerald-400" />
                <span className="text-xs text-zinc-400 uppercase font-bold block">Store Credit Balance</span>
                <span className="text-3xl font-serif font-bold text-emerald-400">₹{user.walletBalance}</span>
                <p className="text-[11px] text-zinc-400">Usable on all Texvalley knitwear & surplus orders</p>
              </div>
            </div>
          )}

          {/* TAB 6: SUPPORT TICKETS */}
          {activeTab === "tickets" && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">
                  Customer Support Tickets
                </h3>
                <button
                  onClick={() => showToast("Support Ticket TCK-982 created! Support will reply via WhatsApp.")}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Create New Ticket
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Ticket TCK-982: Delivery Inquiry</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px]">Resolved</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300">&quot;When will my Pima polo order arrive at Erode?&quot;</p>
                <p className="text-[10px] text-zinc-400">Store Reply: &quot;Your order is dispatched via BlueDart express delivery.&quot;</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
