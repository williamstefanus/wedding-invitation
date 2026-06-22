"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { OpeningScreen } from "./OpeningScreen";
import { CountdownSection } from "./CountdownSection";
import { CoupleSection } from "./CoupleSection";
import { ScheduleSection } from "./ScheduleSection";
import { RSVPSection } from "./RSVPSection";
import { GallerySection } from "./GallerySection";
import { GiftSection } from "./GiftSection";
import { ThankYouSection } from "./ThankYouSection";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

interface WeddingInvitationClientProps {
  invitation: any;
  code: string;
  settings?: any;
}

export function WeddingInvitationClient({ invitation, code, settings }: WeddingInvitationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
    
    // Attempt to play music
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play failed, user may need to interact first", err));
    }

    // Add a delay to allow the greeting and button to fade out smoothly before scrolling
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 800);
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

  // Prevent scrolling globally when not open, and force scroll to top
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prevent browser from trying to restore scroll position on reload
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      
      if (!isOpen) {
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0); // Snap back to the top so the "Open" button is visible
      } else {
        document.body.style.overflow = ""; // Reset to default
      }
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const config = settings?.config || {};
  const musicUrl = config.music_url || "/audio/bgm.mp3";

  return (
    <div className="min-h-[100dvh] w-full bg-neutral-100 flex justify-center">
      <main className="relative min-h-[100dvh] w-full max-w-[420px] overflow-x-hidden bg-white shadow-2xl">
        {/* Background Audio */}
        <audio ref={audioRef} src={musicUrl} loop />

      <OpeningScreen 
        guestName={invitation?.guest?.name || null}
        isOpen={isOpen}
        onOpen={handleOpen}
      />

      {/* Floating Music Toggle Button */}
      {isOpen && (
        <button
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${
            isPlaying ? "[animation:spin_4s_linear_infinite]" : ""
          }`}
          aria-label="Toggle music"
        >
          {/* Full Black Disc SVG */}
          <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#1A1A1A" />
            <circle cx="20" cy="20" r="14" stroke="#333333" strokeWidth="1" />
            <circle cx="20" cy="20" r="10" stroke="#333333" strokeWidth="1" />
            <circle cx="20" cy="20" r="6" stroke="#333333" strokeWidth="1" />
            <circle cx="20" cy="20" r="4" fill="#e2c882" />
            <circle cx="20" cy="20" r="1" fill="#FFFFFF" />
          </svg>
        </button>
      )}

      {/* The main content that shows underneath */}
      <div 
        ref={contentRef}
        className="w-full flex flex-col relative z-20 bg-[#faf9f0]"
      >
        {/* Meadow Flower Divider at the top of the content */}
        <div className="w-full -mt-10 relative z-30 pointer-events-none">
          <Image 
            src="/images/meadow-flower-divider.png" 
            alt="Meadow Flower Divider" 
            width={480} 
            height={295} 
            className="w-full h-auto object-cover object-top" 
          />
        </div>

        <CountdownSection targetDateStr={config.countdown_date || "2026-10-23T11:00:00"} />
        <CoupleSection />
        <ScheduleSection sessions={settings?.sessions ? [settings.sessions.holyMatrimony, settings.sessions.reception].filter(Boolean) : (invitation?.event_type?.sessions || [])} />
        <RSVPSection invitation={invitation} deadline={settings?.deadlines?.wedding} />
        <GallerySection images={config.gallery_images} />
        <GiftSection bank={config.gift_bank} account={config.gift_account} name={config.gift_name} />
        <ThankYouSection names={config.couple_names} />
      </div>
    </main>
    </div>
  );
}
