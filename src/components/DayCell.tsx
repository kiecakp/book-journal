import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DateData } from "react-native-calendars";
import { BookEntry } from "../types";

interface DayCellProps {
  date: DateData;
  entry: BookEntry | undefined;
  onPress: (dateString: string) => void;
  isToday: boolean;
}

export default function DayCell({
  date,
  entry,
  onPress,
  isToday,
}: DayCellProps) {
  const hasBook = !!entry;
  const imageUri = entry?.localImageUri || entry?.coverUrl;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(date.dateString)}
    >
      <View style={[styles.cell, isToday && styles.todayBorder]}>
        {hasBook && imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.emptyCell} />
        )}
        <Text style={[styles.dayNumber, hasBook && styles.dayNumberOnImage]}>
          {date.day}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, aspectRatio: 0.75, padding: 2 },

  cell: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0ece2",
  },

  todayBorder: { borderWidth: 2, borderColor: "#8B5E3C" },
  cover: { width: "100%", height: "100%" },
  emptyCell: { flex: 1 },

  dayNumber: {
    position: "absolute",
    top: 2,
    left: 4,
    fontSize: 11,
    fontWeight: "600",
    color: "#555",
  },

  dayNumberOnImage: {
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 3,
  },
});
