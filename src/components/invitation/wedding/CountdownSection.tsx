"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CountdownSectionProps {
  targetDateStr: string;
}

export function CountdownSection({ targetDateStr }: CountdownSectionProps) {
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [formattedDate, setFormattedDate] = useState("Event");

  useEffect(() => {
    const target = new Date(targetDateStr);
    
    // Format the date using Intl.DateTimeFormat to prevent hydration mismatch
    const formatted = new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(target);
    setFormattedDate(formatted);

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = target.getTime() - now;

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

  const formatDigits = (num: number) => {
    // Dynamically splits numbers into individual character boxes.
    // Falls back to 2 digits with a leading zero if < 10.
    return String(num).padStart(2, '0').split('');
  };

  const days = formatDigits(timeLeft.days);
  const hours = formatDigits(timeLeft.hours);
  const minutes = formatDigits(timeLeft.minutes);

  return (
    <section className="relative w-full px-4 z-40 animate-fade-up -mt-20 flex flex-col items-center">
      
      {/* The Countdown Card */}
      <div className="relative bg-white rounded-[24px] shadow-xl p-5 w-[90%] max-w-[340px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[#4B4B4B] text-lg font-medium">{formattedDate}</h2>
          <button className="p-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Countdown Digits */}
        <div className="flex items-start justify-center gap-2">
          
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              {days.map((digit, idx) => (
                <div key={idx} className="bg-[#F6F6F6] text-[#4B4B4B] text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                  {digit}
                </div>
              ))}
            </div>
            <span className="text-[10px] mt-2 text-gray-500 font-medium lowercase">{t('days')}</span>
          </div>

          <span className="text-xl font-medium text-[#4B4B4B] mt-1 mx-1">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              {hours.map((digit, idx) => (
                <div key={idx} className="bg-[#F6F6F6] text-[#4B4B4B] text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                  {digit}
                </div>
              ))}
            </div>
            <span className="text-[10px] mt-2 text-gray-500 font-medium lowercase">{t('hours')}</span>
          </div>

          <span className="text-xl font-medium text-[#4B4B4B] mt-1 mx-1">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              {minutes.map((digit, idx) => (
                <div key={idx} className="bg-[#F6F6F6] text-[#4B4B4B] text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                  {digit}
                </div>
              ))}
            </div>
            <span className="text-[10px] mt-2 text-gray-500 font-medium lowercase">{t('minutes')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
