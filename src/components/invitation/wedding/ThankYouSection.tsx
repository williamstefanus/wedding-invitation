"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";

export function ThankYouSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative w-full flex flex-col items-center justify-end pb-12 min-h-[500px] z-20 overflow-hidden text-center">
      
      {/* Golden Sandy Background & Flowers */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#416130] via-[#c9951a] to-[#e3b528] opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 z-10 opacity-70 pointer-events-none">
        <AssetPlaceholder label="[bottom_flowers.png]" height="300px" className="border-none bg-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md mx-auto px-4 flex flex-col items-center pt-24 text-slate-800"
      >
        <p className="text-sm font-medium mb-8 max-w-[280px] mx-auto leading-relaxed" style={{ fontFamily: "var(--font-alegreya)" }}>
          It would be our greatest joy to have your presence
          as we celebrate this special moment together.
        </p>

        <h2 className="text-7xl mb-4" style={{ fontFamily: "var(--font-justwrite)" }}>
          Thank You
        </h2>
        
        <p className="italic text-slate-700 text-sm mb-12" style={{ fontFamily: "var(--font-alegreya)" }}>
          for your love and blessings
        </p>

        <p className="text-xs font-medium tracking-widest uppercase text-slate-800" style={{ fontFamily: "var(--font-alegreya)" }}>
          William &amp; Aziel - 2026
        </p>
      </motion.div>
    </section>
  );
}
