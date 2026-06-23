"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface GallerySectionProps {
  images?: string[];
}

export function GallerySection({ images }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<{ url?: string, label?: string } | null>(null);

  const hasImages = images && images.length > 0;

  // Split images into left and right columns for the playful masonry look
  const leftColImages: string[] = [];
  const rightColImages: string[] = [];
  
  if (hasImages) {
    images.forEach((img, idx) => {
      if (idx % 2 === 0) leftColImages.push(img);
      else rightColImages.push(img);
    });
  }

  return (
    <section 
      className="w-full snap-start min-h-[100dvh] flex flex-col items-center justify-center pt-16 pb-48 z-20 relative"
      style={{
        background: "linear-gradient(to bottom, #faf9f0 0%, #faf9f0 40%, #E3F2FD 80%, #90CAF9 100%)"
      }}
    >
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="text-[5.5rem] text-[#4B4B4B] mb-10 leading-none" 
        style={{ fontFamily: "var(--font-justwrite)" }}
      >
        Our Moments
      </motion.h2>

      <div className="w-full max-w-[390px] mx-auto px-6 relative z-30">
        {hasImages ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Real Images Layout */}
            <div className="flex flex-col gap-3">
              {leftColImages.map((url, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  key={`left-${idx}`} 
                  className="cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-sm bg-white"
                  onClick={() => setSelectedImage({ url })}
                >
                  <img src={url} alt={`Gallery image left ${idx + 1}`} loading="lazy" className="w-full h-auto object-cover rounded-xl" />
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-6">
              {rightColImages.map((url, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                  key={`right-${idx}`} 
                  className="cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-sm bg-white"
                  onClick={() => setSelectedImage({ url })}
                >
                  <img src={url} alt={`Gallery image right ${idx + 1}`} loading="lazy" className="w-full h-auto object-cover rounded-xl" />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Placeholder Layout exactly matching Figma */}
            <div className="flex flex-col gap-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="w-full aspect-[4/3] relative rounded-xl overflow-hidden shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform bg-[#E3F2FD]"
                onClick={() => setSelectedImage({ label: "Placeholder" })}
              >
                <Image src="/images/gallery-placeholder.png" fill className="object-cover" alt="Placeholder" />
              </motion.div>
              
              <div className="flex gap-3 w-full">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex-1 aspect-square relative rounded-xl overflow-hidden shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform bg-[#E3F2FD]"
                  onClick={() => setSelectedImage({ label: "Placeholder" })}
                >
                  <Image src="/images/gallery-placeholder.png" fill className="object-cover" alt="Placeholder" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 aspect-square relative rounded-xl overflow-hidden shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform bg-[#E3F2FD]"
                  onClick={() => setSelectedImage({ label: "Placeholder" })}
                >
                  <Image src="/images/gallery-placeholder.png" fill className="object-cover" alt="Placeholder" />
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full aspect-[4/3] relative rounded-xl overflow-hidden shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform bg-[#E3F2FD]"
                onClick={() => setSelectedImage({ label: "Placeholder" })}
              >
                <Image src="/images/gallery-placeholder.png" fill className="object-cover" alt="Placeholder" />
              </motion.div>
            </div>

            <div className="flex flex-col gap-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full aspect-[4/5] relative rounded-xl overflow-hidden shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform bg-[#E3F2FD]"
                onClick={() => setSelectedImage({ label: "Placeholder" })}
              >
                <Image src="/images/gallery-placeholder.png" fill className="object-cover" alt="Placeholder" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full aspect-[4/5] relative rounded-xl overflow-hidden shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform bg-[#E3F2FD]"
                onClick={() => setSelectedImage({ label: "Placeholder" })}
              >
                <Image src="/images/gallery-placeholder.png" fill className="object-cover" alt="Placeholder" />
              </motion.div>
            </div>
          </div>
        )}
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
          
          <div className="relative w-full max-w-[390px] aspect-[3/4] bg-white/5 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             {selectedImage.url ? (
               <img src={selectedImage.url} alt="Gallery item full" className="object-contain w-full h-full" />
             ) : (
               <Image 
                 src="/images/gallery-placeholder.png"
                 alt="Gallery Placeholder Full" 
                 fill 
                 className="object-contain" 
               />
             )}
          </div>
        </div>
      )}
    </section>
  );
}
