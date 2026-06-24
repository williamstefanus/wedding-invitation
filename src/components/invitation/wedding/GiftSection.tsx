"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface GiftSectionProps {
  bank?: string;
  account?: string;
  name?: string;
}

export function GiftSection({ bank, account, name }: GiftSectionProps) {
  const { t } = useLanguage();
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
    <section className="relative w-full snap-start min-h-[100dvh] flex flex-col justify-center items-center bg-[#3A592F] pt-24 pb-32 z-10 overflow-hidden text-center">
      
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
          {t('weddingGift')}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#FFF9ED] text-[15px] leading-relaxed mb-8 whitespace-pre-line" 
          style={{ fontFamily: "var(--font-alegreya)" }}
        >
          {t('giftMessage')}
        </motion.p>

        {/* Bank Card Accordion */}
        <AnimatePresence>
          {showGift && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full overflow-hidden mb-4"
            >
              <div className="w-full bg-[#FAF5E6] rounded-2xl shadow-lg p-6 flex flex-col items-center mt-2">
                <p className="text-[#4B4B4B] text-[15px] mb-1" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {displayBank}
                </p>
                <div className="flex items-center justify-center w-full relative mb-1">
                  <span className="text-[24px] font-bold text-[#4B4B4B]" style={{ fontFamily: "var(--font-alegreya)" }}>
                    {displayAccount}
                  </span>
                </div>
                <p className="text-[#4B4B4B] text-[15px] mb-4" style={{ fontFamily: "var(--font-alegreya)" }}>
                  a/n {displayName}
                </p>

                <button 
                  onClick={handleCopy}
                  className="w-full rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center h-[36px] text-[#4B4B4B] text-[15px] font-medium hover:bg-slate-50 transition active:scale-95 relative overflow-hidden"
                  style={{ fontFamily: "var(--font-alegreya)" }}
                >
                  {copied ? (
                    <span className="flex items-center justify-center gap-2 text-[#3A592F]">
                      <Check className="w-4 h-4" /> {t('copied')}
                    </span>
                  ) : (
                    t('clickToCopy')
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          onClick={() => setShowGift(!showGift)}
          className={`w-full rounded-xl flex items-center justify-center h-[36px] text-[15px] font-medium transition active:scale-95 shadow-sm ${
            showGift 
              ? "bg-[#3A592F] border border-[#FFF9ED]/50 text-[#FFF9ED]" 
              : "bg-[#E5E5E5] border border-transparent text-[#4B4B4B] hover:bg-white"
          }`}
          style={{ fontFamily: "var(--font-alegreya)" }}
        >
          {showGift ? t('done') : t('sendGift')}
        </motion.button>
      </div>

    </section>
  );
}
