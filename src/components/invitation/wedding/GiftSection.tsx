"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface GiftSectionProps {
  bank?: string;
  account?: string;
  name?: string;
}

export function GiftSection({ bank, account, name }: GiftSectionProps) {
  const [showGift, setShowGift] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayBank = bank || "Bank Central Asia (BCA)";
  const displayAccount = account || "1234567890";
  const displayName = name || "William Stefanus";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="relative w-full flex flex-col items-center bg-[#3A592F] pt-24 pb-32 z-10 overflow-hidden text-center">
      
      {/* Top Meadow Transition (overlaps upwards if needed) */}
      <div className="absolute top-[-20px] left-0 w-full z-20 pointer-events-none opacity-80">
        <Image 
          src="/images/meadow-flower-divider.png" 
          alt="Meadow Divider" 
          width={480} 
          height={295} 
          className="w-full h-auto object-cover object-top" 
        />
      </div>

      <div className="relative z-30 w-full max-w-[390px] mx-auto px-6 flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-7xl text-[#FFF9ED] mb-6 leading-none" 
          style={{ fontFamily: "var(--font-justwrite)" }}
        >
          Wedding Gift
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#FFF9ED] text-[15px] leading-relaxed mb-8" 
          style={{ fontFamily: "var(--font-alegreya)" }}
        >
          Your prayer and presence is the best gift,<br />
          but if giving is your expression of love,<br />
          you may use the following feature.
        </motion.p>

        {!showGift && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            onClick={() => setShowGift(true)}
            className="w-full rounded-xl bg-[#E5E5E5] py-3 text-[#4B4B4B] font-medium text-base hover:bg-white transition active:scale-95 shadow-sm"
            style={{ fontFamily: "var(--font-alegreya)" }}
          >
            Send Gift
          </motion.button>
        )}

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
              <div className="w-full bg-[#FFF9ED] rounded-xl shadow-lg p-6 flex flex-col items-center gap-3 mt-2">
                <p className="text-[#4B4B4B] text-[15px]" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {displayBank}
                </p>
                <div className="flex items-center justify-center w-full relative">
                  <span className="text-[28px] font-bold text-[#4B4B4B]" style={{ fontFamily: "var(--font-alegreya)" }}>
                    {displayAccount}
                  </span>
                </div>
                <p className="text-[#4B4B4B] text-[15px] mb-2" style={{ fontFamily: "var(--font-alegreya)" }}>
                  a/n {displayName}
                </p>

                <button 
                  onClick={handleCopy}
                  className="w-full rounded-xl bg-white border border-[#E5E5E5] py-3 text-[#4B4B4B] text-[15px] font-medium hover:bg-slate-50 transition active:scale-95 relative overflow-hidden"
                  style={{ fontFamily: "var(--font-alegreya)" }}
                >
                  {copied ? (
                    <span className="flex items-center justify-center gap-2 text-[#3A592F]">
                      <Check className="w-4 h-4" /> Copied!
                    </span>
                  ) : (
                    "Click to Copy Account Number"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Floral Bouquets Transition */}
      <div className="absolute bottom-[-20px] left-[-20px] z-20 pointer-events-none w-[180px] h-[180px]">
        <Image src="/images/floral-bouquet-left.png" fill className="object-contain object-bottom-left" alt="Floral Left" />
      </div>
      <div className="absolute bottom-[-20px] right-[-20px] z-20 pointer-events-none w-[180px] h-[180px]">
        <Image src="/images/floral-bouquet-right.png" fill className="object-contain object-bottom-right" alt="Floral Right" />
      </div>

    </section>
  );
}
