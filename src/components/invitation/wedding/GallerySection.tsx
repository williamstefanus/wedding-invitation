"use client";

import { useState } from "react";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";
import { X } from "lucide-react";

const placeholderImages = [
  { id: 1, label: "[gallery_1.png]", height: "200px" },
  { id: 2, label: "[gallery_2.png]", height: "150px" },
  { id: 3, label: "[gallery_3.png]", height: "220px" },
  { id: 4, label: "[gallery_4.png]", height: "160px" },
  { id: 5, label: "[gallery_5.png]", height: "230px" },
  { id: 6, label: "[gallery_6.png]", height: "160px" },
];

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<{ id: number, label: string } | null>(null);

  return (
    <section className="w-full flex flex-col items-center bg-white py-16 z-20 relative">
      <h2 className="text-6xl text-slate-800 mb-12" style={{ fontFamily: "var(--font-justwrite)" }}>
        Our Moments
      </h2>

      {/* Masonry Layout */}
      <div className="w-full max-w-4xl mx-auto px-4 columns-2 md:columns-3 gap-4 space-y-4">
        {placeholderImages.map((img) => (
          <div 
            key={img.id} 
            className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-md"
            onClick={() => setSelectedImage(img)}
          >
            <AssetPlaceholder label={img.label} height={img.height} className="w-full border-none bg-sky-100" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full max-w-3xl aspect-[3/4] md:aspect-video bg-white/10 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <AssetPlaceholder label={selectedImage.label} width="100%" height="100%" className="border-none bg-transparent text-white" />
          </div>
        </div>
      )}
    </section>
  );
}
