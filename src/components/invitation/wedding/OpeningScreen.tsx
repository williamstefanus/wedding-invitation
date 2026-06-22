"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WEDDING_INVITATION_ASSETS } from "@/lib/constants/weddingInvitationAssets";

interface OpeningScreenProps {
  guestName: string | null;
  isOpen: boolean;
  onOpen: () => void;
}

export function OpeningScreen({ guestName, isOpen, onOpen }: OpeningScreenProps) {
  return (
    <section 
      className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 40%, #556B2F 100%)",
      }}
    >
      {/* Main Hero Layers */}
      <div className="absolute inset-0 z-0 bg-white">
        {/* Background Mountains (Bleeds to fill screen) */}
        <motion.div 
          className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
            <Image 
              src={WEDDING_INVITATION_ASSETS.heroBackground}
              alt="Hero Background" 
              fill
              priority
              sizes="(max-width: 420px) 100vw, 420px"
              className="object-cover object-top"
            />
        </motion.div>
        
        {/* Safe Area Wrapper for Foreground (Locks proportion of couple + grass to WIDTH) */}
        <div className="absolute inset-x-0 bottom-0 w-full aspect-[390/600] pointer-events-none flex flex-col justify-end">
          
          {/* Couple Photo */}
          <div className="absolute inset-x-0 bottom-[12%] h-[65%] flex justify-center z-10 pointer-events-none">
            <Image 
              src={WEDDING_INVITATION_ASSETS.heroCouplePhoto}
              alt="Hero Couple" 
              fill
              priority
              sizes="(max-width: 420px) 100vw, 420px"
              className="object-contain object-bottom"
            />
          </div>

          {/* Grass Foreground */}
          <motion.div 
            className="absolute inset-x-0 bottom-0 h-[45%] flex flex-col justify-end z-20 pointer-events-none"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <Image 
              src={WEDDING_INVITATION_ASSETS.heroGrassForeground}
              alt="Hero Grass" 
              fill
              priority
              sizes="(max-width: 420px) 100vw, 420px"
              className="object-cover object-bottom translate-y-[5px]"
            />
          </motion.div>
        </div>
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-black/10 z-30 pointer-events-none" />
      </div>

      <div className="relative z-40 flex flex-col items-center justify-between text-center px-4 w-full h-full pb-8 pt-24 sm:pb-16 pointer-events-none">
        
        {/* Title Section - Remains visible */}
        <div className="flex flex-col items-center rotate-[-2deg] drop-shadow-md">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="text-white text-3xl md:text-4xl tracking-wide mb-2" 
            style={{ fontFamily: "var(--font-justwrite)" }}
          >
            The Wedding of
          </motion.span>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.6 }}
            className="flex flex-col items-center text-[#FFDE59] text-6xl md:text-7xl leading-[0.8]" 
            style={{ fontFamily: "var(--font-justwrite)" }}
          >
            <span>William</span>
            <span className="ml-8">& Aziel</span>
          </motion.div>
        </div>

        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
              className="mt-auto flex flex-col items-center gap-4 w-full justify-end pb-[env(safe-area-inset-bottom)] pointer-events-auto"
            >
              <p className="text-white text-xl font-medium drop-shadow-md tracking-wide" style={{ fontFamily: "var(--font-alegreya)" }}>
                Dear {guestName || "Guest"},
              </p>
              
              <motion.button
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="rounded-full bg-[#FFF9ED] text-[#4B4B4B] px-8 py-3 shadow-lg font-medium tracking-wider mt-2 mb-4 transition-colors hover:shadow-xl hover:bg-white"
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
