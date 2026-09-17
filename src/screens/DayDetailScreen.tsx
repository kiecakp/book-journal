import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getEntriesForDate } from "../database/db";
import { useTranslation } from "../i18n/LanguageContext";
import { useTheme } from "../theme/ThemeContext";
import { BookEntry, CalendarStackParamList } from "../types";

type Props = NativeStackScreenProps<CalendarStackParamList, "DayDetail">;

export default function DayDetailScreen({ route, navigation }: Props) {
  const { date } = route.params;
  const { t } = useTranslation();
  const [books, setBooks] = useState<BookEntry[]>([]);
  const { colors } = useTheme();

  const styles = useMemo(() => createStyles(colors), [colors]);

  useFocusEffect(
    useCallback(() => {
      setBooks(getEntriesForDate(date));
    }, [date]),
  );

  const handleAddBook = () => {
    navigation.navigate("ScanBook", { date });
  };

  const renderBook = ({ item }: { item: BookEntry }) => {
    const imageUri = item.localImageUri || item.coverUrl;
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate("BookDetail", { id: item.id, date })}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.rowCover} />
        ) : (
          <View style={[styles.rowCover, styles.rowCoverPlaceholder]} />
        )}
        <View style={styles.rowText}>
          <Text style={styles.rowTitle} numberOfLines={2}>
            {item.title || t("untitled")}
          </Text>
          <Text style={styles.rowAuthor} numberOfLines={1}>
            {item.author || t("unknownAuthor")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>{date}</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderBook}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("noEntry")}</Text>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <Text style={styles.addButtonText}>{t("addBook")}</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    dateHeader: {
      fontSize: 14,
      color: colors.textMuted,
      marginBottom: 12,
      textAlign: "center",
    },
    listContent: { flexGrow: 1, paddingBottom: 12 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cellBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderLight,
      padding: 10,
      marginBottom: 10,
    },
    rowCover: { width: 52, height: 72, borderRadius: 6, marginRight: 12 },
    rowCoverPlaceholder: { backgroundColor: colors.borderLight },
    rowText: { flex: 1 },
    rowTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    rowAuthor: { fontSize: 13, color: colors.textMuted },
    emptyText: {
      fontSize: 15,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: 40,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    addButtonText: { color: colors.textOnImage, fontWeight: "700" },
  });
}
