"use client";

import { RefreshCw } from "lucide-react";

interface RegenerateLinkModalProps {
  isRegenerateOpen: boolean;
  setIsRegenerateOpen: (isOpen: boolean) => void;
  handleRegenerate: () => void;
}

export function RegenerateLinkModal({
  isRegenerateOpen,
  setIsRegenerateOpen,
  handleRegenerate
}: RegenerateLinkModalProps) {
  if (!isRegenerateOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-fade-up p-6 text-center" style={{ backgroundColor: "var(--color-panel-solid)" }}>
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Regenerate Link?</h2>
        <p className="text-slate-500 mb-6 text-sm">This creates a new code. <strong>The old link will immediately stop working.</strong></p>
        <div className="flex justify-center gap-3">
          <button onClick={() => setIsRegenerateOpen(false)} className="px-4 py-2 flex-1 text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 rounded-lg transition">Cancel</button>
          <button onClick={handleRegenerate} className="px-4 py-2 flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition">Regenerate</button>
        </div>
      </div>
    </div>
  );
}
