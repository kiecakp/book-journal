import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { deleteEntry, getEntryForDate, saveEntry } from "../database/db";
import { useTranslation } from "../i18n/LanguageContext";
import { BookEntry, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "DayDetail">;

export default function DayDetailScreen({ route, navigation }: Props) {
  const { date } = route.params;
  const { t } = useTranslation();
  const [entry, setEntry] = useState<BookEntry | null>(null);
  const [notes, setNotes] = useState("");

  useFocusEffect(
    useCallback(() => {
      const found = getEntryForDate(date);
      setEntry(found);
      setNotes(found?.notes ?? "");
    }, [date]),
  );

  const imageUri = entry?.localImageUri || entry?.coverUrl;

  const handleSaveNotes = () => {
    if (!entry) return;
    saveEntry({ ...entry, notes });
    Alert.alert(t("savedTitle"), t("savedMessage"));
  };

  const handleDelete = () => {
    Alert.alert(t("deleteEntryConfirmTitle"), t("deleteEntryConfirmMessage"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          deleteEntry(date);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateHeader}>{date}</Text>

        {entry ? (
          <>
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={styles.cover}
                resizeMode="cover"
              />
            )}
            <Text style={styles.title}>{entry.title || t("untitled")}</Text>
            <Text style={styles.author}>
              {entry.author || t("unknownAuthor")}
            </Text>

            <Text style={styles.label}>{t("notesLabel")}</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder={t("notesPlaceholder")}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveNotes}
            >
              <Text style={styles.saveButtonText}>{t("saveNotes")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("ScanBook", { date })}
            >
              <Text style={styles.secondaryButtonText}>{t("changeBook")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>{t("deleteEntry")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.emptyText}>{t("noEntry")}</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => navigation.navigate("ScanBook", { date })}
            >
              <Text style={styles.saveButtonText}>{t("addBook")}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  dateHeader: { fontSize: 14, color: "#888", marginBottom: 12 },
  cover: { width: 160, height: 220, borderRadius: 10, marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#3a2f28",
  },
  author: {
    fontSize: 15,
    color: "#777",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginTop: 8,
    marginBottom: 6,
  },
  notesInput: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#8B5E3C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8B5E3C",
    marginBottom: 10,
  },
  secondaryButtonText: { color: "#8B5E3C", fontWeight: "600" },
  deleteButton: { paddingVertical: 10 },
  deleteButtonText: { color: "#c0392b", fontWeight: "600" },
  emptyText: { fontSize: 15, color: "#888", marginBottom: 20 },
});
