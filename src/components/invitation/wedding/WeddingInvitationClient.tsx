"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { OpeningScreen } from "./OpeningScreen";
import { CountdownSection } from "./CountdownSection";
import { CoupleSection } from "./CoupleSection";
import { ScheduleSection } from "./ScheduleSection";
import { RSVPSection } from "./RSVPSection";
import { GallerySection } from "./GallerySection";
import { GiftSection } from "./GiftSection";
import { ThankYouSection } from "./ThankYouSection";

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
  const musicUrl = config.musicUrl || "/audio/bgm.mp3";

  const owner = invitation?.guest?.owner;
  const isBride = owner === "bride";
  const giftBank = isBride ? config.giftBankBride : config.giftBankGroom;
  const giftAccount = isBride ? config.giftAccountBride : config.giftAccountGroom;
  const giftName = isBride ? config.giftNameBride : config.giftNameGroom;
  const contactPhone = isBride ? config.phoneBride : config.phoneGroom;

  return (
    <div className="min-h-[100dvh] w-full bg-neutral-100 flex justify-center">
      <main className={`relative h-[100dvh] scroll-smooth w-full max-w-[420px] overflow-x-hidden bg-white shadow-2xl ${isOpen ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <audio ref={audioRef} src={musicUrl} loop preload="none" />

        <OpeningScreen
          guestName={invitation?.guest?.name || null}
          isOpen={isOpen}
          onOpen={handleOpen}
          config={config}
        />

        {isOpen && (
          <button
            onClick={toggleMusic}
            className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#3A592F] text-[#F7E392] shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${isPlaying ? "animate-pulse" : "opacity-80"
              }`}
            aria-label="Toggle music"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" x2="17" y1="9" y2="15" /><line x1="17" x2="23" y1="9" y2="15" /></svg>
            )}
          </button>
        )}

        {isOpen && (
          <div
            ref={contentRef}
            className="w-full flex flex-col relative z-20 bg-[#faf9f0]"
          >
            <section className="w-full flex flex-col relative pt-[15vh]">
              <CountdownSection targetDateStr={config.countdownDate || "2026-10-23T11:00:00"} />
              <TransitionVerse config={config} />
              <CoupleSection config={config} />
            </section>

            <ScheduleSection sessions={settings?.sessions ? [settings.sessions.holyMatrimony, settings.sessions.reception].filter(Boolean) : (invitation?.event_type?.sessions || [])} />
            <RSVPSection invitation={invitation} deadline={settings?.deadlines?.wedding} contactPhone={contactPhone} config={config} />
            <GallerySection images={config.galleryImages} />
            <GiftSection bank={giftBank} account={giftAccount} name={giftName} />
            <ThankYouSection names={`${config.groomFirstName || "John"} & ${config.brideFirstName || "Jane"}`} />
          </div>
        )}
      </main>
    </div>
  );
}

function TransitionVerse({ config }: { config: any }) {
  const { t, language } = useLanguage();
  return (
    <section className="relative w-full flex flex-col items-center px-6 pt-10 pb-6 z-30">
      <p
        className="text-center text-[#4B4B4B] text-[16px] leading-relaxed whitespace-pre-line"
        style={{ fontFamily: "var(--font-alegreya)" }}
      >
        {language === 'id' ? (config.bibleVerseTextId || t('verseText')) : (config.bibleVerseTextEn || t('verseText'))}
        <span className="font-bold block mt-3">{language === 'id' ? (config.bibleVerseReferenceId || t('verseReference')) : (config.bibleVerseReferenceEn || t('verseReference'))}</span>
      </p>
    </section>
  );
}
