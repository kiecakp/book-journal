import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "./src/database/db";
import { LanguageProvider } from "./src/i18n/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { cleanupOldCoverCache } from "./src/services/coverCleanup";
import { ThemeProvider } from "./src/theme/ThemeContext";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function setup() {
      initDatabase();
      await cleanupOldCoverCache();
      setReady(true);
    }
    setup();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <LanguageProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </LanguageProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
