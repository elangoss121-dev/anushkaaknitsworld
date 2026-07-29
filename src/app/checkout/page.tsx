"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { STORE_INFO } from "@/data/store-info";
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  ArrowRight,
  Lock,
  MapPin,
  User,
  Phone
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartGst, cartShipping, cartTotal, placeOrder, showToast } = useShop();

  const [step, setStep] = useState<number>(1);

  // Address Form State
  const [address, setAddress] = useState({
    fullName: "Sivakumar P.",
    phone: "9442707630",
    addressLine: "55, Ground Floor, Global Market, Texvalley, NH47",
    city: "Erode",
    state: "Tamil Nadu",
    pincode: "638102"
  });

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "COD">("UPI");
  const [upiId, setUpiId] = useState("siva@upi");

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold">Your Bag is empty</h2>
        <button onClick={() => router.push("/shop")} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-xs uppercase">
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    const newOrder = placeOrder({
      items: cart,
      subtotal: cartSubtotal,
      discount: 0,
      gst: cartGst,
      shipping: cartShipping,
      total: cartTotal,
      shippingAddress: address,
      paymentMethod: paymentMethod === "UPI" ? `Razorpay UPI (${upiId})` : paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid"
    });

    showToast("🎉 Order Placed Successfully!");
    router.push(`/order-success/${newOrder.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Progress Stepper Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#C8A24D]" : "text-zinc-400"}`}>
          <span className="w-6 h-6 rounded-full bg-[#C8A24D] text-white flex items-center justify-center text-[10px]">
            1
          </span>
          <span>Shipping Address</span>
        </div>
        <span className="text-zinc-300">──</span>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-[#C8A24D]" : "text-zinc-400"}`}>
          <span className="w-6 h-6 rounded-full bg-[#C8A24D] text-white flex items-center justify-center text-[10px]">
            2
          </span>
          <span>Payment Gateway</span>
        </div>
        <span className="text-zinc-300">──</span>
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-[#C8A24D]" : "text-zinc-400"}`}>
          <span className="w-6 h-6 rounded-full bg-[#C8A24D] text-white flex items-center justify-center text-[10px]">
            3
          </span>
          <span>Review & Confirm</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Steps Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
              <h2 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C8A24D]" /> Delivery Address
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold"
              >
                <div className="space-y-1 md:col-span-2">
                  <label className="text-zinc-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Phone Number (For Courier Updates)</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-zinc-500">Flat / House No. / Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.addressLine}
                    onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">State</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full btn-gold py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: RAZORPAY PAYMENT SIMULATOR */}
          {step === 2 && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <h2 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#C8A24D]" /> Razorpay Payment Options
                </h2>
                <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  256-Bit SSL Secured
                </span>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-xs font-bold ${
                    paymentMethod === "UPI"
                      ? "border-[#C8A24D] bg-[#C8A24D]/10 text-zinc-900 dark:text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  <QrCode className="w-6 h-6 text-[#C8A24D]" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-xs font-bold ${
                    paymentMethod === "CARD"
                      ? "border-[#C8A24D] bg-[#C8A24D]/10 text-zinc-900 dark:text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-[#C8A24D]" />
                  <span>Credit/Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("NETBANKING")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-xs font-bold ${
                    paymentMethod === "NETBANKING"
                      ? "border-[#C8A24D] bg-[#C8A24D]/10 text-zinc-900 dark:text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  <ShieldCheck className="w-6 h-6 text-[#C8A24D]" />
                  <span>NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-xs font-bold ${
                    paymentMethod === "COD"
                      ? "border-[#C8A24D] bg-[#C8A24D]/10 text-zinc-900 dark:text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  <Banknote className="w-6 h-6 text-[#C8A24D]" />
                  <span>Cash on Delivery</span>
                </button>
              </div>

              {/* Sub-form inputs */}
              {paymentMethod === "UPI" && (
                <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Enter UPI ID (GooglePay / PhonePe / Paytm)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C8A24D]"
                  />
                  <p className="text-[10px] text-zinc-400">Instant approval via Razorpay Payment Gateway</p>
                </div>
              )}

              {paymentMethod === "COD" && (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <p className="font-bold">Cash on Delivery Info:</p>
                  <p>Pay cash directly to the courier executive upon delivery at your doorstep.</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-xs uppercase"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 btn-gold py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {step === 3 && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
              <h2 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Review & Place Order
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl text-xs space-y-2 md:space-y-0">
                <div>
                  <strong className="text-zinc-900 dark:text-white block font-bold">Shipping To:</strong>
                  <p>{address.fullName}</p>
                  <p>{address.addressLine}, {address.city}, {address.state} – {address.pincode}</p>
                  <p>Phone: {address.phone}</p>
                </div>

                <div>
                  <strong className="text-zinc-900 dark:text-white block font-bold">Payment Method:</strong>
                  <p className="text-[#C8A24D] font-bold">{paymentMethod}</p>
                  <p>Fulfillment: Texvalley Global Market Erode Outlet</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-xs uppercase"
                >
                  ← Back to Payment
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl"
                >
                  Pay ₹{cartTotal.toLocaleString()} & Confirm Order 🎉
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-4">
            <h3 className="font-serif font-bold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-3">
              Bag Items ({cart.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <img src={item.product.images[0]} alt="" className="w-12 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-zinc-900 dark:text-white truncate">{item.product.name}</h4>
                    <p className="text-zinc-400">Qty: {item.quantity} | Size: {item.selectedSize}</p>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>GST (5%)</span>
                <span>₹{cartGst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span>{cartShipping === 0 ? "FREE" : `₹${cartShipping}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span>Total Amount</span>
                <span className="text-[#C8A24D]">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
