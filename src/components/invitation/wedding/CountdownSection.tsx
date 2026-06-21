"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";

interface CountdownSectionProps {
  targetDateStr: string;
}

export function CountdownSection({ targetDateStr }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  return (
    <section className="relative w-full max-w-md mx-auto px-4 z-20 animate-fade-up pt-16 mb-16">
      <div className="relative bg-[#faf9f0] rounded-3xl shadow-xl p-6 border border-[#eae6c8] overflow-hidden">

        <div className="relative z-10 flex flex-col items-center gap-6 mt-2">
          <div className="flex items-center justify-between w-full">
            <span className="text-2xl text-slate-700 font-medium" style={{ fontFamily: "var(--font-alegreya)" }}>
              Fri, 23 Oct 2026
            </span>
            <button className="p-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 md:gap-4 text-slate-800">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl bg-slate-100/80 px-3 py-2 rounded-2xl shadow-inner font-medium">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs mt-2 text-slate-600 font-medium tracking-wide">DAYS</span>
            </div>
            <span className="text-2xl font-bold -mt-6 opacity-50">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl bg-slate-100/80 px-3 py-2 rounded-2xl shadow-inner font-medium">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs mt-2 text-slate-600 font-medium tracking-wide">HOURS</span>
            </div>
            <span className="text-2xl font-bold -mt-6 opacity-50">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl bg-slate-100/80 px-3 py-2 rounded-2xl shadow-inner font-medium">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs mt-2 text-slate-600 font-medium tracking-wide">MINS</span>
            </div>
            <span className="text-2xl font-bold -mt-6 opacity-50">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl bg-slate-100/80 px-3 py-2 rounded-2xl shadow-inner font-medium">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs mt-2 text-slate-600 font-medium tracking-wide">SECS</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
