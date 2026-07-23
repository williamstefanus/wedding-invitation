"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WEDDING_INVITATION_ASSETS } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface OpeningScreenProps {
  guestName: string | null;
  isOpen: boolean;
  onOpen: () => void;
  config?: any;
}

export function OpeningScreen({ guestName, isOpen, onOpen, config = {} }: OpeningScreenProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <section 
      className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-x-hidden z-30"
      style={{
        background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 40%, #556B2F 100%)",
      }}
    >
      {/* Main Hero Layers */}
      <div className="absolute inset-0 z-0 bg-white overflow-hidden">
        {/* Background Mountains (Bleeds to fill screen) */}
        <motion.div 
          className="absolute inset-0 flex justify-center items-end"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
            <Image 
              src={WEDDING_INVITATION_ASSETS.heroBackground}
              alt="Hero Background" 
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center transition-opacity duration-1000 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <Image 
              src={WEDDING_INVITATION_ASSETS.heroBackgroundAfter}
              alt="Hero Background After" 
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            />
        </motion.div>
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-black/10 z-30 pointer-events-none" />
      </div>
      
      {/* Title Graphic - Placed behind couple photo (z-10 vs z-20) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.2 }}
        className="absolute top-0 pt-[48px] [@media(max-width:389px)]:pt-[24px] [@media(max-height:719px)]:pt-[24px] inset-x-0 flex justify-center z-10 pointer-events-none px-4"
      >
        <Image 
          src={WEDDING_INVITATION_ASSETS.heroOpeningTitle}
          alt={`${config.groomFirstName || "John"} & ${config.brideFirstName || "Jane"}`}
          width={280}
          height={158}
          loading="eager"
          className="w-full max-w-[280px] [@media(max-width:389px)]:max-w-[240px] [@media(max-height:719px)]:max-w-[240px] h-auto object-contain drop-shadow-md"
        />
      </motion.div>
      
      {/* Couple Photo - Full Screen Responsive */}
      <div className="absolute inset-0 flex justify-center items-end z-[15] pointer-events-none">
        <Image 
          src={WEDDING_INVITATION_ASSETS.heroCouplePhoto}
          alt="Hero Couple" 
          fill
          priority
          sizes="100vw"
          className={`object-contain object-bottom transition-opacity duration-1000 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        />
        <Image 
          src={WEDDING_INVITATION_ASSETS.heroCouplePhotoAfter}
          alt="Hero Couple After" 
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      
      {/* Safe Area Wrapper for Foreground (Locks proportion of couple + grass to WIDTH) */}
      <div className="absolute inset-x-0 bottom-0 w-full aspect-[390/600] pointer-events-none flex flex-col justify-end z-20">
        

        {/* Grass Foreground */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] flex justify-center z-20 pointer-events-none">
          <Image 
            src={WEDDING_INVITATION_ASSETS.heroGrassForeground}
            alt="Hero Grass" 
            fill
            loading="eager"
            sizes="(max-width: 420px) 100vw, 420px"
            className="object-cover object-bottom"
          />
        </div>
      </div>

      <div className="relative z-40 flex flex-col items-center justify-between text-center px-4 w-full h-full pb-8 pt-24 sm:pb-16 pointer-events-none">

        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
              className="mt-auto flex flex-col items-center gap-4 w-full justify-end pb-[env(safe-area-inset-bottom)] pointer-events-auto"
            >
              <div className="flex flex-col items-center text-center">
                <p className="text-white text-[14px] drop-shadow-md tracking-wide mb-1" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {t('dear')}
                </p>
                <div className="border-b border-white/60 px-4 pb-1 mb-2 min-w-[140px]">
                  <p className="text-white text-xl font-medium drop-shadow-md tracking-wide" style={{ fontFamily: "var(--font-alegreya)" }}>
                    {guestName || ""}
                  </p>
                </div>
              </div>
              
              <motion.button
                animate={language ? { scale: [1, 1.03, 1] } : undefined}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={language ? { scale: 1.05 } : undefined}
                whileTap={language ? { scale: 0.95 } : undefined}
                onClick={language ? onOpen : undefined}
                disabled={!language}
                className={`rounded-full bg-[#FFF9ED] text-[#4B4B4B] px-8 flex items-center justify-center h-[36px] shadow-lg font-medium tracking-wider mt-2 mb-4 transition-all ${
                  language ? "hover:shadow-xl hover:bg-white" : "opacity-60 grayscale cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-alegreya)" }}
              >
                {t('openInvitation')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Language Selection Overlay */}
      <AnimatePresence>
        {!language && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
          >
            <div className="bg-white rounded-xl shadow-2xl p-4 flex gap-4 pointer-events-auto">
              <button onClick={() => setLanguage('en')} className="flex flex-col items-center gap-3 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition min-w-[130px]">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm flex-shrink-0 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" className="w-full h-full object-cover">
                     <clipPath id="s">
                        <path d="M0,0 v60 h60 v-60 z"/>
                      </clipPath>
                      <clipPath id="t">
                        <path d="M30,30 h30 v30 z v-30 h-30 z h-30 v-30 z v30 h30 z"/>
                      </clipPath>
                      <g clipPath="url(#s)">
                        <path d="M0,0 v60 h60 v-60 z" fill="#012169"/>
                        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="6"/>
                        <path d="M0,0 L60,60 M60,0 L0,60" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                        <path d="M30,0 v60 M0,30 h60" stroke="#fff" strokeWidth="10"/>
                        <path d="M30,0 v60 M0,30 h60" stroke="#C8102E" strokeWidth="6"/>
                      </g>
                  </svg>
                </div>
                <span className="text-gray-800 font-serif text-[24px] font-medium tracking-tight leading-none">English</span>
              </button>
              <button onClick={() => setLanguage('id')} className="flex flex-col items-center gap-3 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition min-w-[130px]">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm flex-shrink-0 border border-gray-100 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" className="w-full h-full object-cover">
                    <rect width="60" height="30" fill="#ce1126"/>
                    <rect y="30" width="60" height="30" fill="#fff"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-serif text-[24px] font-medium tracking-tight leading-none">Indonesian</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
