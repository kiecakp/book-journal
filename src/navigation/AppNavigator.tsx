import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LanguageSwitch from "../components/LanguageSwitch";
import { useTranslation } from "../i18n/LanguageContext";
import CalendarScreen from "../screens/CalendarScreen";
import DayDetailScreen from "../screens/DayDetailScreen";
import ScanBookScreen from "../screens/ScanBookScreen";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#3a2f28",
          headerTitleStyle: { fontWeight: "700" },
          headerRight: () => <LanguageSwitch />,
        }}
      >
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ title: t("appTitle") }}
        />
        <Stack.Screen
          name="DayDetail"
          component={DayDetailScreen}
          options={{ title: t("dayDetailTitle") }}
        />
        <Stack.Screen
          name="ScanBook"
          component={ScanBookScreen}
          options={{ title: t("scanTitle") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
