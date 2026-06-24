"use client";

import React, { createContext, useContext, useState } from "react";
import { translations, Language } from "@/lib/translations";

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language | null;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language | null>(null);

  const t = (key: TranslationKey) => {
    // Default to 'en' before selection just for rendering without errors
    const currentLang = language || 'en';
    return translations[currentLang][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
