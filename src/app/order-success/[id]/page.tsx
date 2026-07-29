"use client";

import React, { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { STORE_INFO } from "@/data/store-info";
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  Truck,
  Package,
  Clock,
  ArrowRight,
  MapPin,
  Phone
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { orders } = useShop();

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger festive confetti burst
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  const handlePrintInvoice = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold">Order Not Found</h2>
        <Link href="/" className="btn-gold px-6 py-2.5 rounded-xl font-bold text-xs uppercase">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Celebration Banner */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center space-y-4">
        <div className="w-20 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Payment Confirmed • Order {order.id}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Your order has been received and is being prepared at our flagship store in Texvalley Global Market, Erode.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            onClick={handlePrintInvoice}
            className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-[#111111] font-bold text-xs uppercase flex items-center gap-2 shadow-lg"
          >
            <Printer className="w-4 h-4" /> Download / Print Tax Invoice
          </button>

          <a
            href={`https://wa.me/919566396667?text=${encodeURIComponent(
              `Hi ANUSHKAA KNITS WORLD! I placed Order ${order.id}. Please send me tracking updates.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-4 h-4" /> Send Update via WhatsApp
          </a>
        </div>
      </div>

      {/* Order Tracking Timeline */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6 print:hidden">
        <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#C8A24D]" /> Order Status & Shipment Tracking
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <span className="font-bold text-xs text-zinc-900 dark:text-white block">Order Confirmed</span>
            <span className="text-[10px] text-zinc-400">Payment Received</span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-1">
            <Package className="w-6 h-6 text-[#C8A24D] mx-auto animate-pulse" />
            <span className="font-bold text-xs text-zinc-900 dark:text-white block">Texvalley Packing</span>
            <span className="text-[10px] text-zinc-400">In Progress</span>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-1">
            <Truck className="w-6 h-6 text-zinc-400 mx-auto" />
            <span className="font-bold text-xs text-zinc-900 dark:text-white block">Handed to Courier</span>
            <span className="text-[10px] text-zinc-400">{order.trackingNumber}</span>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-1">
            <Clock className="w-6 h-6 text-zinc-400 mx-auto" />
            <span className="font-bold text-xs text-zinc-900 dark:text-white block">Expected Delivery</span>
            <span className="text-[10px] text-zinc-400">2-3 Business Days</span>
          </div>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div
        ref={invoiceRef}
        className="bg-white text-zinc-900 p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-2xl space-y-8 font-sans"
      >
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 pb-6 gap-4">
          <div>
            <h2 className="font-serif text-3xl font-black tracking-widest text-[#111111]">
              ANUSHKAA
            </h2>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8A24D]">
              KNITS WORLD • TEXVALLEY ERODE
            </span>
            <p className="text-[11px] text-zinc-500 mt-1">{STORE_INFO.address.fullAddress}</p>
            <p className="text-[11px] text-zinc-500">GSTIN: 33ABCDE1234F1Z9 | Phone: +91 9442707630</p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <span className="bg-[#111111] text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase">
              TAX INVOICE
            </span>
            <p className="font-bold text-sm text-zinc-900 pt-1">Invoice #: {order.id}</p>
            <p className="text-zinc-500">Date: {order.date}</p>
            <p className="text-zinc-500">Payment: {order.paymentMethod}</p>
          </div>
        </div>

        {/* Billed To Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-zinc-50 p-4 rounded-xl">
          <div>
            <strong className="text-zinc-900 font-bold block mb-1">Billed & Shipped To:</strong>
            <p className="font-semibold text-zinc-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
            <p>Contact: {order.shippingAddress.phone}</p>
          </div>

          <div>
            <strong className="text-zinc-900 font-bold block mb-1">Dispatch Depot:</strong>
            <p className="font-semibold text-zinc-900">ANUSHKAA KNITS WORLD Flagship Store</p>
            <p>Shop 55, Ground Floor, Global Market</p>
            <p>Texvalley, NH47, Erode – 638102</p>
            <p>Hotline: 9442707630 / WhatsApp: 9566396667</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-zinc-900 text-zinc-600 font-bold uppercase">
              <th className="py-3">Item Description</th>
              <th className="py-3 text-center">Size</th>
              <th className="py-3 text-center">Color</th>
              <th className="py-3 text-center">Qty</th>
              <th className="py-3 text-right">Price</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-zinc-200">
                <td className="py-3 font-semibold text-zinc-900">{item.product.name}</td>
                <td className="py-3 text-center">{item.selectedSize}</td>
                <td className="py-3 text-center">{item.selectedColor}</td>
                <td className="py-3 text-center font-bold">{item.quantity}</td>
                <td className="py-3 text-right">₹{item.product.price.toLocaleString()}</td>
                <td className="py-3 text-right font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Calculations */}
        <div className="flex justify-end pt-2">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount Applied:</span>
                <span>-₹{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Apparel GST (5%):</span>
              <span>₹{order.gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Shipping Charges:</span>
              <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-zinc-900 pt-2 border-t border-zinc-900">
              <span>Grand Total:</span>
              <span className="text-[#C8A24D]">₹{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-zinc-200 text-[10px] text-zinc-400 text-center">
          Thank you for shopping with ANUSHKAA KNITS WORLD, Texvalley Global Market, Erode. This is a computer-generated tax invoice.
        </div>
      </div>
    </div>
  );
}
