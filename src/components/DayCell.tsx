import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { DateData } from "react-native-calendars";
import { useTheme } from "../theme/ThemeContext";
import { BookEntry } from "../types";

interface DayCellProps {
  date: DateData;
  entries: BookEntry[];
  onPress: (dateString: string) => void;
  isToday: boolean;
  currentMonth: number;
  currentYear: number;
}

export default function DayCell({
  date,
  entries,
  onPress,
  isToday,
  currentMonth,
  currentYear,
}: DayCellProps) {
  const { colors } = useTheme();
  const isOutsideMonth =
    date.month !== currentMonth || date.year !== currentYear;

  const [triedRemoteFallback, setTriedRemoteFallback] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);
  if (isOutsideMonth) return null;

  const entry = entries[0];
  const extraCount = entries.length - 1;
  const preferLocal = !triedRemoteFallback && !!entry?.localImageUri;
  const imageUri = preferLocal ? entry?.localImageUri : entry?.coverUrl;

  const handleImageError = () => {
    if (preferLocal && entry?.coverUrl) {
      setTriedRemoteFallback(true);
    } else {
      setImageFailed(true);
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(date.dateString)}
    >
      <View style={[styles.cell, isToday && styles.todayBorder]}>
        {imageUri && !imageFailed ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.cover}
            resizeMode="cover"
            onError={handleImageError}
          />
        ) : (
          <View style={styles.emptyCell} />
        )}

        {extraCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>+{extraCount}</Text>
          </View>
        )}

        <Text style={[styles.dayNumber, imageUri && styles.dayNumberOnImage]}>
          {date.day}
        </Text>
      </View>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    container: {
      width: 55,
      height: 80,
      padding: 2,
    },

    cell: {
      flex: 1,
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: colors.cellBackground,
    },

    todayBorder: {
      borderWidth: 2,
      borderColor: colors.primary,
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
      color: colors.textPrimary,
    },

    dayNumberOnImage: {
      color: colors.textOnImage,
      textShadowColor: colors.textShadow,
      textShadowOffset: {
        width: 1,
        height: 1,
      },
      textShadowRadius: 3,
    },

    badge: {
      position: "absolute",
      bottom: 2,
      right: 2,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: 5,
      paddingVertical: 1,
      minWidth: 16,
      alignItems: "center",
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.textOnImage,
    },
  });
}
