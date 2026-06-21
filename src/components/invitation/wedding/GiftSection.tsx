"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";
import { motion, AnimatePresence } from "framer-motion";

export function GiftSection() {
  const [showGift, setShowGift] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("1234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="relative w-full flex flex-col items-center bg-[#416130] py-16 z-20 overflow-hidden text-center">
      
      {/* Grass background texture would go here */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
        <AssetPlaceholder label="[grass_texture.png]" height="100%" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 flex flex-col items-center">
        <h2 className="text-6xl text-white mb-6" style={{ fontFamily: "var(--font-justwrite)" }}>
          Wedding Gift
        </h2>

        <p className="text-white text-base leading-relaxed mb-8 font-medium" style={{ fontFamily: "var(--font-alegreya)" }}>
          Your prayer and presence is the best gift,<br />
          but if giving is your expression of love,<br />
          you may use the following feature.
        </p>

        <button 
          onClick={() => setShowGift(!showGift)}
          className="rounded-full border border-white/60 px-10 py-3 text-white text-sm hover:bg-white/10 transition mb-4"
          style={{ fontFamily: "var(--font-alegreya)" }}
        >
          Send Gift
        </button>

        {/* Bank Card Accordion */}
        <AnimatePresence>
          {showGift && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full overflow-hidden"
            >
              <div className="w-full bg-[#faf9f0] rounded-xl shadow-lg p-6 flex flex-col items-center gap-2 mt-4">
                <p className="text-slate-600 font-medium" style={{ fontFamily: "var(--font-alegreya)" }}>
                  Bank Central Asia (BCA)
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-800">1234567890</span>
                  <button 
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-slate-600 transition p-2 relative"
                    title="Copy Account Number"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
                <p className="text-slate-500" style={{ fontFamily: "var(--font-alegreya)" }}>
                  a/n William Stefanus
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
