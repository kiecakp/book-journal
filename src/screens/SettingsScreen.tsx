import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown, { DropdownOption } from "../components/Dropdown";
import { useTranslation } from "../i18n/LanguageContext";
import { Language } from "../i18n/translations";
import { useTheme } from "../theme/ThemeContext";
import { ThemeMode } from "../theme/colors";

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const languageOptions: DropdownOption<Language>[] = [
    { value: "pl", label: t("languagePolish") },
    { value: "en", label: t("languageEnglish") },
  ];

  const themeOptions: DropdownOption<ThemeMode>[] = [
    { value: "light", label: t("themeLight"), icon: "sunny" },
    { value: "dark", label: t("themeDark"), icon: "moon" },
    { value: "auto", label: t("themeAuto"), icon: "contract" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Text style={styles.sectionTitle}>{t("settingsAppearance")}</Text>
      <View style={styles.card}>
        <Dropdown
          label={t("languageLabel")}
          value={language}
          options={languageOptions}
          onChange={setLanguage}
        />
        <View style={styles.divider} />
        <Dropdown
          label={t("themeLabel")}
          value={mode}
          options={themeOptions}
          onChange={setMode}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background, paddingTop: 20 },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginHorizontal: 16,
      marginBottom: 8,
    },
    card: {
      backgroundColor: colors.cellBackground,
      marginHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.borderLight,
      overflow: "hidden",
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginLeft: 16,
    },
  });
}
