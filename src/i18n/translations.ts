export const translations = {
  pl: {},

  en: {},
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.pl;
