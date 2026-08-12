import { createContext, ReactNode, useContext, useState } from "react";
import { Language, TranslationKey, translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pl");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "pl" ? "en" : "pl"));
  };

  const t = (key: TranslationKey): string => translations[language][key];

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useTranslation must be used within a LanguageProvider");
  return ctx;
}
