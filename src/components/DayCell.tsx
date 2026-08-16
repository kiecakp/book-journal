import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { DateData } from "react-native-calendars";
import { BookEntry } from "../types";

interface DayCellProps {
  date: DateData;
  entry: BookEntry | undefined;
  onPress: (dateString: string) => void;
  isToday: boolean;
  currentMonth: number;
  currentYear: number;
}

export default function DayCell({
  date,
  entry,
  onPress,
  isToday,
  currentMonth,
  currentYear,
}: DayCellProps) {
  const isOutsideMonth =
    date.month !== currentMonth || date.year !== currentYear;
  if (isOutsideMonth) return null;

  const imageUri = entry?.localImageUri || entry?.coverUrl;

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(date.dateString)}
    >
      <View style={[styles.cell, isToday && styles.todayBorder]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.emptyCell} />
        )}

        <Text style={[styles.dayNumber, imageUri && styles.dayNumberOnImage]}>
          {date.day}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 55,
    height: 80,
    padding: 2,
  },

  cell: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3EEE9",
  },

  todayBorder: {
    borderWidth: 2,
    borderColor: "#8B5E3C",
  },

  cover: {
    width: "100%",
    height: "100%",
  },

  emptyCell: {
    flex: 1,
  },

  dayNumber: {
    position: "absolute",
    top: 2,
    left: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#3a2f28",
  },

  dayNumberOnImage: {
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 3,
  },
});
