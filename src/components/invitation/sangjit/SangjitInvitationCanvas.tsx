import React from "react";

interface SangjitInvitationCanvasProps {
  children: React.ReactNode;
}

export function SangjitInvitationCanvas({ children }: SangjitInvitationCanvasProps) {
  return (
    <div className="w-full min-h-screen bg-[#E6E6E6] flex justify-center">
      <div className="w-full max-w-[480px] mx-auto relative overflow-visible bg-white shadow-2xl">
        {children}
      </div>
    </div>
  );
}
