import React, {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";
import { useColorScheme } from "react-native";
import { ColorPalette, darkColors, lightColors, ThemeMode } from "./colors";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
  colors: ColorPalette;
  resolvedScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const systemScheme = useColorScheme();

  // gdy mode='auto' idziemy za ustawieniami telefonu, w przeciwnym razie uzytkownik decyduje sam
  const resolvedScheme: "light" | "dark" =
    mode === "auto" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const colors = resolvedScheme === "dark" ? darkColors : lightColors;

  const cycleMode = () => {
    setMode((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "auto" : "light",
    );
  };

  const value = useMemo(
    () => ({ mode, setMode, cycleMode, colors, resolvedScheme }),
    [mode, colors, resolvedScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme musi byc uzyty wewnatrz ThemeProvider");
  return ctx;
}
