import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useTranslation } from "../i18n/LanguageContext";
import LibraryScreen from "../screens/LibraryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useTheme } from "../theme/ThemeContext";
import { RootTabParamList } from "../types";
import CalendarStackNavigator from "./CalendarStackNavigator";

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> =
  {
    Library: "library-outline",
    CalendarTab: "calendar-outline",
    Settings: "settings-outline",
  };

export default function AppNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="CalendarTab"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.borderLight,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={tabIcons[route.name]} size={size} color={color} />
          ),
        })}
      >
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{ title: t("tabLibrary") }}
        />
        <Tab.Screen
          name="CalendarTab"
          component={CalendarStackNavigator}
          options={{ title: t("tabCalendar") }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: t("tabSettings") }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
