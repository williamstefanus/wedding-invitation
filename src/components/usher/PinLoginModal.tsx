"use client";

import { useState } from "react";
import { verifyWoPin } from "@/lib/actions/usher";
import { Lock, Delete, Loader2, ShieldCheck } from "lucide-react";

interface PinLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function PinLoginModal({ isOpen, onSuccess }: PinLoginModalProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleNumClick = (num: string) => {
    if (loading || pin.length >= 8) return;
    setError("");
    const nextPin = pin + num;
    setPin(nextPin);
  };

  const handleDelete = () => {
    if (loading || pin.length === 0) return;
    setError("");
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError("");

    try {
      const res = await verifyWoPin(pin);
      if (res.success) {
        localStorage.setItem("wo_authorized", "true");
        onSuccess();
      } else {
        setError(res.error || "Incorrect PIN code");
        setPin("");
      }
    } catch {
      setError("An error occurred verifying the PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 flex flex-col items-center animate-fade-up border border-slate-100">
        
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 text-amber-600 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Usher Access</h1>
        <p className="text-xs text-slate-500 text-center mt-1 mb-6 max-w-[240px]">
          Enter the Wedding Organizer PIN code to access the check-in portal.
        </p>

        {/* PIN Display */}
        <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl h-14 flex items-center justify-center gap-3 mb-6 px-4 shadow-inner">
          {pin ? (
            Array.from({ length: pin.length }).map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-scale-up shadow-sm" />
            ))
          ) : (
            <span className="text-sm font-semibold text-slate-400">Enter PIN code</span>
          )}
        </div>

        {error && (
          <div className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs text-center font-bold mb-4 animate-shake">
            ✕ {error}
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumClick(num)}
              disabled={loading}
              className="h-14 bg-slate-50 hover:bg-slate-100 active:bg-amber-50 active:border-amber-300 border border-slate-200/80 rounded-2xl text-xl font-bold text-slate-800 transition shadow-sm flex items-center justify-center disabled:opacity-50"
            >
              {num}
            </button>
          ))}
          <div /> {/* blank corner */}
          <button
            type="button"
            onClick={() => handleNumClick("0")}
            disabled={loading}
            className="h-14 bg-slate-50 hover:bg-slate-100 active:bg-amber-50 active:border-amber-300 border border-slate-200/80 rounded-2xl text-xl font-bold text-slate-800 transition shadow-sm flex items-center justify-center disabled:opacity-50"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || !pin}
            className="h-14 bg-slate-50 hover:bg-rose-50 active:bg-rose-100 text-slate-500 hover:text-rose-600 border border-slate-200/80 rounded-2xl transition shadow-sm flex items-center justify-center disabled:opacity-30"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !pin}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" /> Unlock Portal
            </>
          )}
        </button>

      </div>
    </div>
  );
}
