"use client";

import { useState, useRef, useEffect } from "react";
import { OpeningScreen } from "./OpeningScreen";
import { CountdownSection } from "./CountdownSection";
import { CoupleSection } from "./CoupleSection";
import { SaveTheDateSection } from "./SaveTheDateSection";
import { EventDetailsSection } from "./EventDetailsSection";
import { RSVPSection } from "./RSVPSection";
import { GallerySection } from "./GallerySection";
import { GiftSection } from "./GiftSection";
import { ThankYouSection } from "./ThankYouSection";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

interface WeddingInvitationClientProps {
  invitation: any;
  code: string;
}

export function WeddingInvitationClient({ invitation, code }: WeddingInvitationClientProps) {
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

  // Prevent scrolling globally when not open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">
      {/* Background Audio */}
      <audio ref={audioRef} src="/audio/bgm.mp3" loop />

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
            {/* Main black vinyl disc */}
            <circle cx="20" cy="20" r="20" fill="#1A1A1A" />
            {/* Inner grooves */}
            <circle cx="20" cy="20" r="14" stroke="#333333" strokeWidth="1" />
            <circle cx="20" cy="20" r="10" stroke="#333333" strokeWidth="1" />
            <circle cx="20" cy="20" r="6" stroke="#333333" strokeWidth="1" />
            {/* Center label (gold) */}
            <circle cx="20" cy="20" r="4" fill="#e2c882" />
            {/* Center hole */}
            <circle cx="20" cy="20" r="1" fill="#FFFFFF" />
          </svg>
        </button>
      )}

      {/* The main content that shows underneath */}
      <div 
        ref={contentRef}
        className="w-full flex flex-col relative z-20"
      >
        <CountdownSection targetDateStr="2026-10-23T11:00:00" />
        <CoupleSection />
        <SaveTheDateSection />
        <EventDetailsSection sessions={invitation?.event_type?.sessions || []} />
        <RSVPSection invitation={invitation} />
        <GallerySection />
        <GiftSection />
        <ThankYouSection />
      </div>
    </main>
  );
}
