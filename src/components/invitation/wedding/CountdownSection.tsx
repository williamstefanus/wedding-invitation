"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

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

  const formatDigits = (num: number) => {
    const str = String(num).padStart(2, '0');
    return [str[0], str[1]];
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
          <h2 className="text-black text-lg font-medium">Event</h2>
          <button className="p-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Countdown Digits */}
        <div className="flex items-start justify-center gap-2">
          
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              <div className="bg-[#F6F6F6] text-black text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                {days[0]}
              </div>
              <div className="bg-[#F6F6F6] text-black text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                {days[1]}
              </div>
            </div>
            <span className="text-[10px] mt-2 text-gray-500 font-medium lowercase">days</span>
          </div>

          <span className="text-xl font-medium text-black mt-1 mx-1">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              <div className="bg-[#F6F6F6] text-black text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                {hours[0]}
              </div>
              <div className="bg-[#F6F6F6] text-black text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                {hours[1]}
              </div>
            </div>
            <span className="text-[10px] mt-2 text-gray-500 font-medium lowercase">hours</span>
          </div>

          <span className="text-xl font-medium text-black mt-1 mx-1">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="flex gap-1">
              <div className="bg-[#F6F6F6] text-black text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                {minutes[0]}
              </div>
              <div className="bg-[#F6F6F6] text-black text-2xl w-[32px] h-[40px] rounded-lg flex items-center justify-center font-medium">
                {minutes[1]}
              </div>
            </div>
            <span className="text-[10px] mt-2 text-gray-500 font-medium lowercase">minutes</span>
          </div>

        </div>
      </div>
    </section>
  );
}
