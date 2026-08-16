import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import DayCell from "../components/DayCell";
import { getAllEntries } from "../database/db";
import { BookEntry, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Calendar">;

const todayString = new Date().toISOString().split("T")[0];

export default function CalendarScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<Record<string, BookEntry>>({});

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
      <Calendar
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
          backgroundColor: "#fff",
          calendarBackground: "#fff",
          textSectionTitleColor: "#8B5E3C",
          monthTextColor: "#3a2f28",
          textMonthFontWeight: "700",
          textMonthFontSize: 20,
          arrowColor: "#8B5E3C",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendar: {
    height: 380,
  },
});
