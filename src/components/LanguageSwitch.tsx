import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "../i18n/LanguageContext";

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useTranslation();

  return (
    <TouchableOpacity onPress={toggleLanguage} style={styles.button}>
      <Text style={styles.text}>{language === "pl" ? "PL" : "EN"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#f0ece2",
  },
  text: { fontSize: 13, fontWeight: "600", color: "#8B5E3C" },
});
