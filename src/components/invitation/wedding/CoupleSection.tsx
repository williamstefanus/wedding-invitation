import Image from "next/image";
import { motion } from "framer-motion";
import { WEDDING_INVITATION_ASSETS as ASSET } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

export function CoupleSection({ config = {} }: { config?: any }) {
  const { t, language } = useLanguage();

  const generateParentsText = (role: 'groom' | 'bride') => {
    const order = config[`${role}BirthOrder`] || (role === 'groom' ? "1" : "2");
    const gender = config[`${role}Gender`] || (role === 'groom' ? "son" : "daughter");
    const father = config[`${role}FatherName`] || (role === 'groom' ? "Hadi Doe" : "Yopie Doe");
    const mother = config[`${role}MotherName`] || (role === 'groom' ? "Lanny Doe" : "Ina Doe");

    const orderStr = t(`order_${order}` as any) || order;
    const genderStr = t(gender as any);
    const ofStr = t('of');
    const mrStr = t('mr');
    const mrsStr = t('mrs');
    const andStr = t('and');

    if (language === 'id') {
      return `${genderStr} ${orderStr.toLowerCase()} ${ofStr}\n${mrStr} ${father} ${andStr}\n${mrsStr} ${mother}`;
    } else {
      return `${orderStr} ${genderStr} ${ofStr}\n${mrStr} ${father} ${andStr}\n${mrsStr} ${mother}`;
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center bg-[#faf9f0] overflow-hidden pb-[48px]">
      
      {/* 1. Background Sky/Grass - Bleeds to fill screen width without side gaps */}
      <div className="absolute top-0 inset-x-0 w-full pointer-events-none opacity-90 z-0 flex justify-center scale-[1.2] origin-top">
        <Image src={ASSET.envelopeGreenHillTransition} alt="Sky Decor" width={800} height={600} className="w-full h-auto object-cover" />
      </div>

      {/* Container matching Figma's 390px canvas width */}
      <div className="relative w-full max-w-[390px] flex flex-col items-center z-10">

        {/* 2. Envelope Composition Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1.0 }}
          className="relative w-[90%] aspect-[410/417] mt-[80px] flex justify-center z-10"
        >
          {/* Back Panel */}
          <div className="absolute inset-0 z-10">
            <Image src={ASSET.envelopeBackPanel} alt="Envelope Back" fill sizes="420px" className="object-contain" />
          </div>

          {/* Meadow Flap - Centered inside top half */}
          {/* We remove the wild rotation from Figma to allow it to sit perfectly as a flap liner */}
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[80%] aspect-square z-20">
            <Image src={ASSET.envelopeMeadowFlap} alt="Envelope Flap" fill sizes="300px" className="object-contain object-top" />
          </div>

          {/* Floral Bouquet - Placed blooming over the left side */}
          <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[15%] left-[-15%] w-[85%] aspect-square z-30 drop-shadow-md"
          >
            <Image src={ASSET.floralBouquetLeft} alt="Bouquet" fill sizes="300px" className="object-contain" />
          </motion.div>
        </motion.div>

        {/* 3. Paper Card & Wax Seal Layer */}
        {/* Placed overlapping the envelope's bottom half */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="relative w-[88%] aspect-[354/490] -mt-[40%] z-50 flex flex-col items-center"
        >
          {/* Paper Card Background */}
          <div className="absolute inset-0 z-0">
            <Image src={ASSET.envelopePaperCard} alt="Paper Card" fill sizes="420px" className="object-contain" />
          </div>

          {/* Wax Seal - Centered directly on top edge */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.6 }}
            className="absolute -top-[8%] left-1/2 -translate-x-1/2 w-[22%] aspect-square z-50"
          >
            <Image src={ASSET.waxSealGold} alt="Wax Seal" fill sizes="100px" className="object-contain" />
          </motion.div>

          {/* 4. Text and Stamps Content Container */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between px-[6%] py-[15%]">
            
            {/* Groom Row */}
            <div className="flex items-center justify-between w-full h-[35%]">
               {/* Stamp Container */}
              <div className="relative w-[45%] aspect-[152/172] rotate-[7deg] shrink-0 scale-[1.1]">
                {/* We use standard inset so the photo fits nicely inside the stamp frame */}
                <div className="absolute inset-[6.5%] overflow-hidden bg-slate-200 z-10 rounded-sm">
                  <Image src={ASSET.groomPhotoWilliam} alt="Groom" fill sizes="200px" className="object-cover scale-[1.04]" />
                </div>
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <Image src={ASSET.stampFrame} alt="Stamp" fill sizes="200px" className="object-fill" />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center justify-center w-[50%] gap-1">
                <div className="text-center text-[#4B4B4B] text-[2.2rem] leading-[0.9]" style={{ fontFamily: "var(--font-justwrite)" }}>
                  {config.groomFirstName || "John"}<br/>{config.groomLastName || "Stefanus"},
                  {config.groomTitle && <div className="text-[1.8rem] mt-1">{config.groomTitle}</div>}
                </div>
                <div className="text-center text-[#4B4B4B] text-[0.7rem] leading-snug mt-2 whitespace-pre-line" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {generateParentsText('groom')}
                </div>
              </div>
            </div>

            {/* Middle */}
            <div className="w-full text-center text-[#4B4B4B] text-[1.2rem] my-2" style={{ fontFamily: "var(--font-alegreya)" }}>
              {t('and')}
            </div>

            {/* Bride Row */}
            <div className="flex items-center justify-between w-full h-[35%] flex-row-reverse">
              {/* Stamp Container */}
              <div className="relative w-[45%] aspect-[152/172] -rotate-[7deg] shrink-0 scale-[1.1]">
                <div className="absolute inset-[6.5%] overflow-hidden bg-slate-200 z-10 rounded-sm">
                  <Image src={ASSET.bridePhotoAziel} alt="Bride" fill sizes="200px" className="object-cover object-top scale-[1.04]" />
                </div>
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <Image src={ASSET.stampFrame} alt="Stamp" fill sizes="200px" className="object-fill" />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center justify-center w-[50%] gap-1">
                <div className="text-center text-[#4B4B4B] text-[2.2rem] leading-[0.9]" style={{ fontFamily: "var(--font-justwrite)" }}>
                  {config.brideFirstName || "Jane"}<br/>{config.brideLastName || "Yorieza"},
                  {config.brideTitle && <div className="text-[1.8rem] mt-1">{config.brideTitle}</div>}
                </div>
                <div className="text-center text-[#4B4B4B] text-[0.7rem] leading-snug mt-2 whitespace-pre-line" style={{ fontFamily: "var(--font-alegreya)" }}>
                  {generateParentsText('bride')}
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
