"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { motion } from "framer-motion";

interface GallerySectionProps {
  images?: string[];
}

function BentoGalleryBlock({ images, onSelect, isPlaceholder = false }: { images: string[], onSelect: (url: string) => void, isPlaceholder?: boolean }) {
  if (images.length < 5) return null;
  return (
    <div className="flex gap-3 w-full aspect-square">
      {/* Left Column */}
      <div className="flex flex-col gap-3 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6 }}
          className="flex-[0.4] rounded-xl overflow-hidden relative cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform shadow-sm bg-[#E3F2FD]"
          onClick={() => onSelect(isPlaceholder ? "Placeholder" : images[0])}
        >
          {isPlaceholder ? <Image src={images[0]} fill className="object-cover" alt="Placeholder" /> : <img src={images[0]} alt="Gallery" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-[0.6] rounded-xl overflow-hidden relative cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform shadow-sm bg-[#E3F2FD]"
          onClick={() => onSelect(isPlaceholder ? "Placeholder" : images[1])}
        >
          {isPlaceholder ? <Image src={images[1]} fill className="object-cover" alt="Placeholder" /> : <img src={images[1]} alt="Gallery" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
        </motion.div>
      </div>
      {/* Right Column */}
      <div className="flex flex-col gap-3 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-[0.55] rounded-xl overflow-hidden relative cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform shadow-sm bg-[#E3F2FD]"
          onClick={() => onSelect(isPlaceholder ? "Placeholder" : images[2])}
        >
          {isPlaceholder ? <Image src={images[2]} fill className="object-cover" alt="Placeholder" /> : <img src={images[2]} alt="Gallery" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
        </motion.div>
        <div className="flex-[0.45] flex gap-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 rounded-xl overflow-hidden relative cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform shadow-sm bg-[#E3F2FD]"
            onClick={() => onSelect(isPlaceholder ? "Placeholder" : images[3])}
          >
            {isPlaceholder ? <Image src={images[3]} fill className="object-cover" alt="Placeholder" /> : <img src={images[3]} alt="Gallery" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 rounded-xl overflow-hidden relative cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform shadow-sm bg-[#E3F2FD]"
            onClick={() => onSelect(isPlaceholder ? "Placeholder" : images[4])}
          >
            {isPlaceholder ? <Image src={images[4]} fill className="object-cover" alt="Placeholder" /> : <img src={images[4]} alt="Gallery" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function GallerySection({ images = [] }: GallerySectionProps) {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<{ url?: string, label?: string } | null>(null);

  const hasImages = images && images.length > 0;

  let topHeroImage: string | null = null;
  const bentoChunks: string[][] = [];
  const remainingImages: string[] = [];
  
  if (hasImages) {
    topHeroImage = images[0];
    const rest = images.slice(1);
    
    // Chunk images into sets of 5 for the Bento layout
    for (let i = 0; i < rest.length; i += 5) {
      if (i + 5 <= rest.length) {
        bentoChunks.push(rest.slice(i, i + 5));
      } else {
        remainingImages.push(...rest.slice(i));
      }
    }
  }

  const placeholderBentoImages = Array(5).fill("/images/gallery-placeholder.png");

  return (
    <section 
      className="w-full flex flex-col items-center py-[48px] z-20 relative bg-[#faf9f0] overflow-hidden"
    >
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="text-[64px] text-[#4B4B4B] mb-10 leading-none" 
        style={{ fontFamily: "var(--font-justwrite)" }}
      >
        {t('ourMoments')}
      </motion.h2>

      <div className="w-full max-w-[390px] mx-auto px-4 relative z-30">
        <div className="flex flex-col gap-3">
          {hasImages ? (
            <>
              {topHeroImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6 }}
                  className="cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-sm bg-white w-full aspect-[4/3]"
                  onClick={() => setSelectedImage({ url: topHeroImage! })}
                >
                  <img src={topHeroImage} alt="Gallery hero" loading="lazy" className="w-full h-full object-cover rounded-xl" />
                </motion.div>
              )}

              {bentoChunks.map((chunk, idx) => (
                <BentoGalleryBlock 
                  key={idx} 
                  images={chunk} 
                  onSelect={(url) => setSelectedImage({ url })} 
                />
              ))}

              {remainingImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-3">
                    {remainingImages.filter((_, i) => i % 2 === 0).map((url, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        key={`rem-left-${idx}`} 
                        className="cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-sm bg-white w-full aspect-[4/3]"
                        onClick={() => setSelectedImage({ url })}
                      >
                        <img src={url} alt={`Gallery image`} loading="lazy" className="w-full h-full object-cover rounded-xl" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    {remainingImages.filter((_, i) => i % 2 !== 0).map((url, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                        key={`rem-right-${idx}`} 
                        className="cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-sm bg-white w-full aspect-[4/3]"
                        onClick={() => setSelectedImage({ url })}
                      >
                        <img src={url} alt={`Gallery image`} loading="lazy" className="w-full h-full object-cover rounded-xl" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Top Large Hero Placeholder */}
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

              {/* Bento Box Layout for Placeholder */}
              <BentoGalleryBlock 
                images={placeholderBentoImages} 
                onSelect={() => setSelectedImage({ label: "Placeholder" })} 
                isPlaceholder={true} 
              />
            </>
          )}
        </div>
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
