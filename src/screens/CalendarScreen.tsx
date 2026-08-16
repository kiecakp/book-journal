import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import DayCell from "../components/DayCell";
import { getAllEntries } from "../database/db";
import { useTranslation } from "../i18n/LanguageContext";
import "../i18n/calendarLocale";
import { colors } from "../theme/colors";
import { BookEntry, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Calendar">;

const todayString = new Date().toISOString().split("T")[0];

export default function CalendarScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<Record<string, BookEntry>>({});
  const [visibleDate, setVisibleDate] = useState(todayString);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { language, t } = useTranslation();

  LocaleConfig.defaultLocale = language;

  const handleGoToToday = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setVisibleDate(todayString + "-" + Date.now());
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleGoToToday} style={styles.todayButton}>
          <Text style={styles.todayButtonText}>{t("goToToday")}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, language]);

  useFocusEffect(
    useCallback(() => {
      setEntries(getAllEntries());
    }, []),
  );

  const handleDayPress = (dateString: string) => {
    navigation.navigate("DayDetail", { date: dateString });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <Calendar
          key={`${language}-${visibleDate}`}
          current={todayString}
          enableSwipeMonths={true}
          style={styles.calendar}
          firstDay={1}
          hideExtraDays={true}
          dayComponent={({ date }) =>
            date ? (
              <DayCell
                date={date}
                entry={entries[date.dateString]}
                onPress={handleDayPress}
                isToday={date.dateString === todayString}
                currentMonth={date.month}
                currentYear={date.year}
              />
            ) : null
          }
          theme={{
            backgroundColor: colors.background,
            calendarBackground: colors.background,
            textSectionTitleColor: colors.primary,
            monthTextColor: colors.textPrimary,
            textMonthFontWeight: "700",
            textMonthFontSize: 20,
            arrowColor: colors.primary,
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  calendar: {
    height: 380,
  },
  todayButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
});
