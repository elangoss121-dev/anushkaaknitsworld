"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, PhoneCall, ArrowUp } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappUrl = `https://wa.me/919566396667?text=${encodeURIComponent(
    "Hello ANUSHKAA KNITS WORLD! I am interested in your luxury fashion & export surplus collection."
  )}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* Floating Call Button */}
      <a
        href="tel:9442707630"
        title="Call Store Hotline"
        className="w-12 h-12 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white rounded-full shadow-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform duration-300 group"
      >
        <PhoneCall className="w-5 h-5 text-[#C8A24D] group-hover:rotate-12 transition-transform" />
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp (+91 9566396667)"
        className="relative w-13 h-13 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </a>

      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Back to Top"
          className="w-10 h-10 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
