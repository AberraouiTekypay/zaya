"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fr } from "./dictionaries/fr";
import { ar } from "./dictionaries/ar";
import { en } from "./dictionaries/en";

export type Locale = "fr" | "ar" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
  t: (path: string, fallback?: string) => string;
}

const dictionaries = { fr, ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zaya_locale") as Locale;
      if (saved && (saved === "fr" || saved === "ar" || saved === "en")) {
        return saved;
      }
    }
    return "fr";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("zaya_locale", newLocale);
      const dir = newLocale === "ar" ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = newLocale;
    }
  };

  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  const t = (path: string, fallback?: string): string => {
    const dict = dictionaries[locale] || dictionaries.fr;
    const parts = path.split(".");
    let current: unknown = dict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        // Fallback to french if missing in ar/en
        let frFallback: unknown = dictionaries.fr;
        for (const p of parts) {
          if (frFallback && typeof frFallback === "object" && p in frFallback) {
            frFallback = (frFallback as Record<string, unknown>)[p];
          } else {
            return fallback || path;
          }
        }
        return typeof frFallback === "string" ? frFallback : fallback || path;
      }
    }

    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
