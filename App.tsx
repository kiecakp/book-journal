import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { initDatabase } from "./src/database/db";
import { LanguageProvider } from "./src/i18n/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDatabase();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </LanguageProvider>
  );
}
