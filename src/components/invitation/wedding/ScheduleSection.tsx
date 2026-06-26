"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { WEDDING_INVITATION_ASSETS } from "@/lib/constants";

interface ScheduleSectionProps {
  sessions: any[];
}

export function ScheduleSection({ sessions = [] }: ScheduleSectionProps) {
  const { t, language } = useLanguage();
  
  const holyMatrimonySession = sessions.length > 0 ? sessions[0] : {
    name: "Holy Matrimony",
    start_time: "11:00",
    end_time: "12:00",
    venue_name: "IFGF Bandung Citylink",
    address: "Festival Citylink Mall Lantai 3A",
    google_maps_url: "#"
  };

  const receptionSession = sessions.length > 1 ? sessions[1] : {
    name: "Reception Dinner",
    start_time: "18:00",
    end_time: "20:00",
    venue_name: "Royal Dynasty Restaurant (3rd Floor)",
    address: "Jl. Sudirman No.232A",
    google_maps_url: "#"
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  const splitTitle = (title?: string) => {
    if (!title) return { first: "", second: "" };
    const parts = title.split(" ");
    if (parts.length >= 2) {
      return { first: parts[0], second: parts.slice(1).join(" ") };
    }
    return { first: title, second: "" };
  };

  // Translate the names
  const getSessionName = (name: string) => {
    if (name.includes("Holy Matrimony")) return t('holyMatrimony');
    if (name.includes("Reception")) return t('reception');
    return name;
  };

  const holyName = getSessionName(holyMatrimonySession.name || "Holy Matrimony");
  const holyTitle = splitTitle(holyName);

  const receptionName = getSessionName(receptionSession.name || "Reception Dinner");
  const receptionTitle = splitTitle(receptionName);

  const dateObj = new Date("2026-10-23");
  const weekdayStr = new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
  }).format(dateObj);
  const dayMonthYearStr = new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);

  return (
    <section className="relative w-full flex flex-col items-center bg-[#3A592F] z-10 pt-16 pb-[360px]">
      
      {/* Top Meadow Divider */}
      <div className="absolute top-[-30px] left-0 w-full z-20 pointer-events-none">
        <Image 
          src="/images/meadow-flower-divider.png"
          alt="Meadow Top Divider"
          width={750}
          height={579}
          className="w-full h-auto object-contain object-bottom"
        />
      </div>

      <div className="w-full max-w-[390px] mx-auto flex flex-col relative z-30 pt-10 px-6">
        
        {/* Save The Date Composition */}
        <div className="relative w-full flex items-center justify-center mb-4 h-[180px]">
          
          {/* Torn Date Paper (Right/Back) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-[220px] aspect-[241/82] flex items-center justify-center z-10"
          >
            <Image src="/images/torn-date-paper.png" fill className="object-contain" alt="Torn Paper" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#3A592F] pl-8 pr-2 text-center">
              <span className="text-[19px] sm:text-[20px] font-medium leading-[1.2]" style={{ fontFamily: "var(--font-alegreya)" }}>{weekdayStr},</span>
              <span className="text-[18px] sm:text-[19px] font-medium leading-[1.2]" style={{ fontFamily: "var(--font-alegreya)" }}>{dayMonthYearStr}</span>
            </div>
          </motion.div>

          {/* Gold Badge (Left/Front) */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-[160px] aspect-[196/235] flex items-center justify-center z-20"
          >
            <Image src="/images/save-date-gold-badge.png" fill className="object-contain drop-shadow-lg" alt="Gold Badge" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#faf9f0] text-center pt-2">
              <span className="text-4xl leading-none" style={{ fontFamily: "var(--font-justwrite)" }}>SAVE</span>
              <span className="text-xl my-1" style={{ fontFamily: "var(--font-justwrite)" }}>- the -</span>
              <span className="text-4xl leading-none" style={{ fontFamily: "var(--font-justwrite)" }}>DATE</span>
            </div>
          </motion.div>
          
        </div>

        {/* Events Block */}
        <div className="flex flex-col w-full gap-10 text-[#faf9f0]">
          
          {/* Event 1: Holy Matrimony */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col w-full items-center"
          >
            <div className="flex w-full items-end justify-between mb-6">
              <div className="flex flex-col text-right items-end flex-1 pr-2">
                <h3 className="flex flex-col text-5xl text-[#faf9f0] mb-3 leading-[0.8]" style={{ fontFamily: "var(--font-justwrite)" }}>
                  <span>{holyTitle.first}</span>
                  {holyTitle.second && <span className="mr-6">{holyTitle.second}</span>}
                </h3>
                <p className="text-[18px] mb-1 font-bold tracking-wide" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {formatTime(holyMatrimonySession.start_time)} - {formatTime(holyMatrimonySession.end_time)}
                </p>
                <p className="text-[16px] font-bold mb-0.5 leading-tight" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {holyMatrimonySession.venue_name}
                </p>
                <p className="text-[16px] opacity-90 leading-tight" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {holyMatrimonySession.address}
                </p>
              </div>
              <div className="relative w-[120px] aspect-square shrink-0">
                <Image src="/images/holy-matrimony-illustration.png" fill className="object-contain object-bottom" alt="Holy Matrimony" />
              </div>
            </div>

            {holyMatrimonySession.google_maps_url && (
              <a 
                href={holyMatrimonySession.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[90%] flex items-center justify-center h-[36px] rounded-2xl border border-white/80 text-white text-sm hover:bg-white/10 transition-colors font-medium active:scale-95"
                style={{ fontFamily: "var(--font-alegreya)" }}
              >
                {t('openGoogleMaps')}
              </a>
            )}
          </motion.div>

          {/* Event 2: Reception Dinner */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col w-full items-center"
          >
            <div className="flex w-full items-end justify-between mb-6">
              <div className="relative w-[140px] aspect-[360/360] shrink-0 -ml-2">
                <Image src="/images/reception-dinner-illustration.png" fill className="object-contain object-bottom" alt="Reception Dinner" />
              </div>
              <div className="flex flex-col text-left items-start flex-1 pl-4">
                <h3 className="flex flex-col text-5xl text-[#faf9f0] mb-3 leading-[0.8]" style={{ fontFamily: "var(--font-justwrite)" }}>
                  <span>{receptionTitle.first}</span>
                  {receptionTitle.second && <span className="ml-4">{receptionTitle.second}</span>}
                </h3>
                <p className="text-[18px] mb-1 font-bold tracking-wide" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {formatTime(receptionSession.start_time)} - {formatTime(receptionSession.end_time)}
                </p>
                <p className="text-[16px] font-bold mb-0.5 leading-tight" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {receptionSession.venue_name}
                </p>
                <p className="text-[16px] opacity-90 leading-tight" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {receptionSession.address}
                </p>
              </div>
            </div>

            {receptionSession.google_maps_url && (
              <a 
                href={receptionSession.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[90%] flex items-center justify-center h-[36px] rounded-2xl border border-white/80 text-white text-sm hover:bg-white/10 transition-colors font-medium active:scale-95"
                style={{ fontFamily: "var(--font-alegreya)" }}
              >
                {t('openGoogleMaps')}
              </a>
            )}
          </motion.div>

        </div>
      </div>

      {/* Bottom Transition Daisy Garden */}
      <div className="absolute bottom-[-10px] left-0 w-full z-20 pointer-events-none">
        <Image 
          src="/images/daisy-garden-divider.png"
          alt="Daisy Garden Divider"
          width={500}
          height={373}
          className="w-full h-auto object-contain object-bottom"
        />
      </div>

    </section>
  );
}
