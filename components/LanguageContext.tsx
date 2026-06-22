"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  DICTIONARIES,
  LANGUAGES,
  type Dict,
  type Language,
} from "@/lib/i18n";

const STORAGE_KEY = "homehunt.language";

type Ctx = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dict;
};

const LanguageCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (LANGUAGES as readonly string[]).includes(saved)) {
      setLanguageState(saved as Language);
    }
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* localStorage may be unavailable */
    }
  }

  return (
    <LanguageCtx.Provider
      value={{ language, setLanguage, t: DICTIONARIES[language] }}
    >
      {children}
    </LanguageCtx.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageCtx);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
