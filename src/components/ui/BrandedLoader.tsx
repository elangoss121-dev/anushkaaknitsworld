"use client";

import React from "react";

interface BrandedLoaderProps {
  message?: string;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ message = "Loading Luxury Knitwear..." }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#111111] flex flex-col items-center justify-center p-6 space-y-8 animate-fadeIn">
      {/* Outer Glowing Logo Ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-[#C8A24D]/20 animate-ping absolute" />
        <div className="w-20 h-20 rounded-full border border-[#C8A24D]/40 animate-spin border-t-[#C8A24D] absolute" />
        
        {/* Brand Crest Initials */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#111111] to-zinc-900 border border-[#C8A24D]/60 flex items-center justify-center shadow-2xl z-10">
          <span className="font-serif text-xl font-bold tracking-widest text-[#C8A24D]">
            AKW
          </span>
        </div>
      </div>

      {/* Brand Title & Tagline */}
      <div className="text-center space-y-1.5">
        <h2 className="font-serif text-2xl font-black tracking-widest text-white">
          ANUSHKAA
        </h2>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C8A24D]">
          KNITS WORLD • TEXVALLEY
        </p>
      </div>

      {/* Elegant Progress Indicator */}
      <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-[#C8A24D] via-amber-200 to-[#C8A24D] animate-pulse w-full" />
      </div>

      {/* Loading Message */}
      <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};
