import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "../i18n/LanguageContext";
import BookDetailScreen from "../screens/BookDetailScreen";
import CalendarScreen from "../screens/CalendarScreen";
import DayDetailScreen from "../screens/DayDetailScreen";
import ScanBookScreen from "../screens/ScanBookScreen";
import { useTheme } from "../theme/ThemeContext";
import { CalendarStackParamList } from "../types";

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export default function CalendarStackNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: "700" },
        headerTitleAlign: "center",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={{ title: t("appTitle") }}
      />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={{
          title: t("dayDetailTitle"),
        }}
      />
      <Stack.Screen
        name="ScanBook"
        component={ScanBookScreen}
        options={{
          title: t("scanTitle"),
        }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{
          title: t("bookDetailTitle"),
        }}
      />
    </Stack.Navigator>
  );
}
