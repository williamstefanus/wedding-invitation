import Image from "next/image";
import { WEDDING_INVITATION_ASSETS } from "@/lib/constants";

interface EventDetailsSectionProps {
  sessions: any[];
}

export function EventDetailsSection({ sessions = [] }: EventDetailsSectionProps) {
  return (
    <section className="w-full flex flex-col items-center bg-[#416130] pb-16 z-20 relative overflow-hidden">
      
      {sessions.map((session, index) => {
        const isEven = index % 2 === 0;
        
        // Define format based on whether it's even (Holy Matrimony style) or odd (Reception Dinner style)
        const layoutClass = isEven 
          ? "flex-row justify-between items-center mt-16 mb-16 gap-4" 
          : "flex-row-reverse justify-between items-center mb-16 gap-4";
          
        const textAlignmentClass = isEven ? "items-start text-left" : "items-end text-right";
        const placeholderImg = isEven ? WEDDING_INVITATION_ASSETS.holyMatrimonyIllustration : WEDDING_INVITATION_ASSETS.receptionDinnerIllustration;
        const placeholderClass = isEven ? "w-[120px] h-[140px]" : "w-[140px] h-[140px] -ml-4";

        // Format time string from "HH:MM:SS" to "HH:MM"
        const formatTime = (timeString: string) => {
          if (!timeString) return "";
          const parts = timeString.split(":");
          if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
          }
          return timeString;
        };

        return (
          <div key={session.id} className={`w-full max-w-md mx-auto px-4 flex ${layoutClass}`}>
            <div className={`flex flex-col text-white z-10 ${textAlignmentClass}`}>
              <h3 className="text-5xl lg:text-6xl mb-2" style={{ fontFamily: "var(--font-justwrite)" }}>
                {session.name}
              </h3>
              <p className="text-base mb-1" style={{ fontFamily: "var(--font-alegreya)" }}>
                {formatTime(session.start_time)} - {formatTime(session.end_time)}
              </p>
              <p className="text-lg font-bold mb-1 tracking-wide" style={{ fontFamily: "var(--font-alegreya)" }}>
                {session.venue_name}
              </p>
              <p className="text-sm font-light text-slate-200 mb-6" style={{ fontFamily: "var(--font-alegreya)" }}>
                {session.address}
              </p>
              {session.google_maps_url && (
                <a 
                  href={session.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/60 px-6 py-2 text-white text-sm hover:bg-white/10 transition font-medium"
                  style={{ fontFamily: "var(--font-alegreya)" }}
                >
                  Open Google Maps
                </a>
              )}
            </div>
            
            <div className={`shrink-0 relative opacity-90 ${placeholderClass}`}>
              <Image src={placeholderImg} alt={session.name || "Event"} fill className="object-contain drop-shadow-md" />
            </div>
          </div>
        );
      })}

      {/* Floral Divider to RSVP Section */}
      <div className="w-full mt-8 -mb-24 relative z-30 h-[200px]">
        <Image src={WEDDING_INVITATION_ASSETS.daisyGardenDivider} alt="Divider" fill className="object-contain" />
      </div>

    </section>
  );
}
