"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface OpeningScreenProps {
  guestName: string | null;
  isOpen: boolean;
  onOpen: () => void;
}

export function OpeningScreen({ guestName, isOpen, onOpen }: OpeningScreenProps) {
  return (
    <section 
      className="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 40%, #556B2F 100%)",
      }}
    >
      {/* Main Hero Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero_background.png?v=2" 
          alt="Hero Background" 
          fill
          priority
          className="object-cover object-top opacity-80"
          unoptimized
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pb-32 pt-20">
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="mt-auto flex flex-col items-center gap-4 w-full h-full justify-end"
            >
              <p className="text-white text-lg font-medium drop-shadow-sm tracking-wide">
                Dear {guestName || "Guest"},
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="rounded-full border border-white/40 bg-white/10 px-8 py-3 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 shadow-lg animate-pulse-gold font-medium tracking-wider mt-4"
                style={{ fontFamily: "var(--font-alegreya)" }}
              >
                Open Invitation
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
