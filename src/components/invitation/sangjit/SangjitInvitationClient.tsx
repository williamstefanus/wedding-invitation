"use client";

import React, { useState, useRef, useEffect } from "react";
import { SangjitOpeningScreen } from "./SangjitOpeningScreen";
import { SangjitHeroCountdownSection } from "./SangjitHeroCountdownSection";
import { SangjitCoupleEnvelopeSection } from "./SangjitCoupleEnvelopeSection";
import { SangjitScheduleSection } from "./SangjitScheduleSection";
import { SangjitRSVPSection } from "./SangjitRSVPSection";
import { SangjitGiftSection } from "./SangjitGiftSection";
import { SangjitThankYouSection } from "./SangjitThankYouSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface SangjitInvitationClientProps {
  invitation: any;
  code: string;
  settings?: any;
}

export function SangjitInvitationClient({ invitation, code, settings }: SangjitInvitationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const config = settings?.config || {};
  const musicUrl = config.sangjit_music_url || config.music_url || "/audio/bgm.mp3";

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play failed", err));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <LanguageProvider>
      <div className="min-h-[100dvh] w-full bg-[#FAFAFA] flex justify-center">
        <main className={`relative scroll-smooth w-full max-w-[480px] mx-auto overflow-x-hidden bg-[#761B33] shadow-2xl ${isOpen ? 'min-h-[100dvh]' : 'h-[100dvh] overflow-hidden'}`}>
          <audio ref={audioRef} src={musicUrl} loop />

          {/* Floating Music Toggle Button matching Wedding style */}
          {isOpen && (
            <button
              onClick={toggleMusic}
              className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#761B33] text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 ${isPlaying ? "animate-pulse" : "opacity-80"}`}
              aria-label="Toggle music"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>
              )}
            </button>
          )}

          {/* Screen 1 Cover Overlay (Fades out gracefully in place) */}
          <SangjitOpeningScreen 
            guestName={invitation?.guest?.name || null}
            isOpen={isOpen}
            onOpen={handleOpen}
          />

          {/* Underlying Invitation Content Canvas */}
          <div ref={contentRef} className="w-full flex flex-col relative z-10 bg-[#761B33]">
            <SangjitHeroCountdownSection 
              targetDateStr={settings?.config?.date || "2026-10-17T00:00:00"} 
            />
            <SangjitCoupleEnvelopeSection invitation={invitation} />
            <SangjitScheduleSection invitation={invitation} />
            <SangjitRSVPSection invitation={invitation} />
            <SangjitGiftSection invitation={invitation} />
            <SangjitThankYouSection invitation={invitation} />
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
