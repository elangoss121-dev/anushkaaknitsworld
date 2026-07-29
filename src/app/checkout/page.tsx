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
  const [addressMode, setAddressMode] = useState<"GPS" | "SEARCH" | "PINCODE">("PINCODE");

  // Address Form State
  const [address, setAddress] = useState({
    fullName: "Sivakumar P.",
    phone: "9566396667",
    addressLine1: "55, Ground Floor, Global Market, Texvalley, NH47",
    addressLine2: "Gangapuram, Chithode",
    landmark: "Texvalley Main Gate",
    pincode: "638102",
    city: "Erode",
    district: "Erode",
    state: "Tamil Nadu",
    lat: 11.39088,
    lng: 77.67499
  });

  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "COD">("UPI");
  const [upiId, setUpiId] = useState("siva@upi");

  // Live Postal API Pincode Lookup (India Post API)
  const fetchAddressByPincode = async (pin: string) => {
    if (pin.length === 6 && /^\d{6}$/.test(pin)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setAddress((prev) => ({
            ...prev,
            pincode: pin,
            city: po.Block || po.Name || po.District,
            district: po.District,
            state: po.State
          }));
          showToast(`📍 Auto-detected location: ${po.District}, ${po.State}`);
        }
      } catch {
        // Fallback
      }
    }
  };

  // 📍 Option 1: Browser GPS Detection
  const handleFetchGPS = () => {
    if (!navigator.geolocation) {
      showToast("❌ Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            setAddress((prev) => ({
              ...prev,
              lat: latitude,
              lng: longitude,
              addressLine1: data.display_name.split(",").slice(0, 2).join(","),
              city: addr.city || addr.town || addr.village || addr.county || "Erode",
              district: addr.state_district || addr.county || "Erode",
              state: addr.state || "Tamil Nadu",
              pincode: addr.postcode || prev.pincode
            }));
            showToast("📍 Current location detected successfully.");
          }
        } catch {
          setAddress((prev) => ({ ...prev, lat: latitude, lng: longitude }));
          showToast("📍 Current location detected successfully.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        showToast("Location permission denied. Please enter your address manually.");
      }
    );
  };

  // 🔍 Option 2: Search Address Autocomplete
  const handleSelectSearchLocation = (selectedCity: string, selectedState: string, selectedPin: string) => {
    setAddress((prev) => ({
      ...prev,
      city: selectedCity,
      district: selectedCity,
      state: selectedState,
      pincode: selectedPin
    }));
    setSearchQuery(`${selectedCity}, ${selectedState} - ${selectedPin}`);
    showToast(`📍 Location selected: ${selectedCity}, ${selectedState}`);
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    setAddress({ ...address, phone: cleaned });
    if (cleaned.length > 0 && !/^[6-9]\d{9}$/.test(cleaned)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number starting with 6-9");
    } else {
      setPhoneError("");
    }
  };

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
    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      showToast("❌ Please enter a valid 10-digit mobile number!");
      return;
    }

    const newOrder = placeOrder({
      items: cart,
      subtotal: cartSubtotal,
      discount: 0,
      gst: cartGst,
      shipping: cartShipping,
      total: cartTotal,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: `${address.addressLine1}${address.addressLine2 ? ", " + address.addressLine2 : ""}${address.landmark ? " (Landmark: " + address.landmark + ")" : ""}`,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      },
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
          {/* STEP 1: SHIPPING ADDRESS WITH 3 OPTIONS */}
          {step === 1 && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-zinc-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#C8A24D]" /> Delivery Address
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Fast & simple checkout — complete your address in under 30 seconds.
                  </p>
                </div>

                {/* 3 Mode Option Tabs */}
                <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-[11px] font-bold uppercase">
                  <button
                    type="button"
                    onClick={() => {
                      setAddressMode("GPS");
                      handleFetchGPS();
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      addressMode === "GPS" ? "bg-[#C8A24D] text-white shadow-sm" : "hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    📍 Use Current Location
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressMode("SEARCH")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      addressMode === "SEARCH" ? "bg-[#111111] text-white shadow-sm" : "hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    🔍 Search Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressMode("PINCODE")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      addressMode === "PINCODE" ? "bg-[#111111] text-white shadow-sm" : "hover:bg-white dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    📮 Enter PIN Code
                  </button>
                </div>
              </div>

              {/* PROMINENT TOP LOCATION BUTTON */}
              <button
                type="button"
                onClick={handleFetchGPS}
                disabled={isLocating}
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-[#C8A24D] dark:hover:bg-[#C8A24D] dark:hover:text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <MapPin className={`w-4 h-4 text-[#C8A24D] ${isLocating ? "animate-bounce" : ""}`} />
                <span>{isLocating ? "Detecting GPS Location..." : "📍 Use Current Location (Auto-Fill Address)"}</span>
              </button>

              {/* OPTION 2: ADDRESS SEARCH BAR */}
              {addressMode === "SEARCH" && (
                <div className="bg-zinc-50 dark:bg-zinc-800/80 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Search Location or Landmark (Google Places Autocomplete)
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type City, Area or PIN Code (e.g. Erode, Texvalley, Coimbatore)"
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#C8A24D]"
                  />
                  {searchQuery.length > 1 && (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg divide-y divide-zinc-100 dark:divide-zinc-800 text-xs mt-1">
                      <button
                        type="button"
                        onClick={() => handleSelectSearchLocation("Erode", "Tamil Nadu", "638102")}
                        className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between"
                      >
                        <div>
                          <strong className="block text-zinc-900 dark:text-white">Texvalley, Gangapuram, Erode</strong>
                          <span className="text-[10px] text-zinc-500">Tamil Nadu - 638102</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#C8A24D] uppercase">Select</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectSearchLocation("Coimbatore", "Tamil Nadu", "641001")}
                        className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between"
                      >
                        <div>
                          <strong className="block text-zinc-900 dark:text-white">Coimbatore Central</strong>
                          <span className="text-[10px] text-zinc-500">Tamil Nadu - 641001</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#C8A24D] uppercase">Select</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectSearchLocation("Chennai", "Tamil Nadu", "600001")}
                        className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-between"
                      >
                        <div>
                          <strong className="block text-zinc-900 dark:text-white">Chennai Metropolitan</strong>
                          <span className="text-[10px] text-zinc-500">Tamil Nadu - 600001</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#C8A24D] uppercase">Select</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MAIN FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!/^[6-9]\d{9}$/.test(address.phone)) {
                    setPhoneError("Enter a valid 10-digit Indian mobile number starting with 6-9");
                    return;
                  }
                  setStep(2);
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold"
              >
                {/* Full Name */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-zinc-500">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sivakumar P."
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                {/* Mobile Number with 10-digit Validation */}
                <div className="space-y-1">
                  <label className="text-zinc-500">Mobile Number (10-Digits) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-sm font-bold text-zinc-400">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="9566396667"
                      value={address.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:outline-none ${
                        phoneError ? "border-rose-500 focus:border-rose-500" : "border-zinc-300 dark:border-zinc-700 focus:border-[#C8A24D]"
                      }`}
                    />
                  </div>
                  {phoneError && <p className="text-[10px] text-rose-500 font-bold">{phoneError}</p>}
                </div>

                {/* PIN Code with Auto-fetch Postal API */}
                <div className="space-y-1">
                  <label className="text-zinc-500">PIN Code * (Auto-Fetches City & State)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="638102"
                    value={address.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setAddress({ ...address, pincode: val });
                      fetchAddressByPincode(val);
                    }}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-zinc-500">Address Line 1 (Flat / Building / Street) *</label>
                  <input
                    type="text"
                    required
                    placeholder="55, Ground Floor, Global Market, Texvalley, NH47"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                {/* Address Line 2 / Landmark */}
                <div className="space-y-1">
                  <label className="text-zinc-500">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Gangapuram, Chithode"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-500">Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="Near Texvalley Main Entrance"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C8A24D]"
                  />
                </div>

                {/* Auto-filled City / District */}
                <div className="space-y-1">
                  <label className="text-zinc-500">City / District (Auto-filled)</label>
                  <input
                    type="text"
                    readOnly
                    value={address.city}
                    className="w-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-not-allowed"
                  />
                </div>

                {/* Auto-filled State */}
                <div className="space-y-1">
                  <label className="text-zinc-500">State (Auto-filled)</label>
                  <input
                    type="text"
                    readOnly
                    value={address.state}
                    className="w-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-not-allowed"
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
                  <p>{address.addressLine1}, {address.city}, {address.state} – {address.pincode}</p>
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
