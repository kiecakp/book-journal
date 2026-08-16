import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LanguageSwitch from "../components/LanguageSwitch";
import { useTranslation } from "../i18n/LanguageContext";
import CalendarScreen from "../screens/CalendarScreen";
import DayDetailScreen from "../screens/DayDetailScreen";
import ScanBookScreen from "../screens/ScanBookScreen";
import { colors } from "../theme/colors";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: "700" },
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
          options={{
            title: t("dayDetailTitle"),
            headerRight: () => <LanguageSwitch />,
          }}
        />
        <Stack.Screen
          name="ScanBook"
          component={ScanBookScreen}
          options={{
            title: t("scanTitle"),
            headerRight: () => <LanguageSwitch />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
