export interface ColorPalette {
  primary: string;
  primaryLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnImage: string;
  background: string;
  cellBackground: string;
  danger: string;
  textShadow: string;
  borderLight: string;
}

// tryb jasny
export const lightColors: ColorPalette = {
  // kolory podstawowe / makra
  primary: "#8B5E3C", // brązowy - akcenty, przyciski, obramowania
  primaryLight: "#f0ece2", // jasny beż - tła nieaktywnych elementów, przyciski

  // tekst
  textPrimary: "#3a2f28", // ciemny brąz - główne nagłówki, tytuły
  textSecondary: "#555", // szary - numery dni, drugorzedny tekst
  textMuted: "#777", // jaśniejszy szary - autor, tekst pomocniczy
  textOnImage: "#fff", // biiały - tekst na tle okładek / zdjęć

  // tła
  background: "#fff",
  cellBackground: "#F3EEE9",

  // stany / akcje
  danger: "#c0392b", // czerwony - usuwanie, błędy

  // cienie tekstu (na obrazkach)
  textShadow: "rgba(0, 0, 0, 0.7)",

  // obramowania
  borderLight: "#ddd",
} as const;

// tryb ciemny
export const darkColors: ColorPalette = {
  primary: "#C89B6B",
  primaryLight: "#3A2E24",

  textPrimary: "#F0E6D8",
  textSecondary: "#C9B8A6",
  textMuted: "#9C8873",
  textOnImage: "#fff",

  background: "#1C1410",
  cellBackground: "#2A2019",

  danger: "#E07A5F",
  textShadow: "rgba(0, 0, 0, 0.9)",
  borderLight: "#4A3B2E",
} as const;

export type ThemeMode = "light" | "dark" | "auto";
