import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
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
  View,
} from "react-native";
import { deleteEntry, getEntryById, saveEntry } from "../database/db";
import { useTranslation } from "../i18n/LanguageContext";
import { cacheCoverImage } from "../services/imageCache";
import { useTheme } from "../theme/ThemeContext";
import { BookEntry, CalendarStackParamList } from "../types";

type Props = NativeStackScreenProps<CalendarStackParamList, "BookDetail">;

type ImageSource = "local" | "remote" | "failed";

export default function BookDetailScreen({ route, navigation }: Props) {
  const { id, date } = route.params;
  const { t } = useTranslation();
  const [entry, setEntry] = useState<BookEntry | null>(null);
  const [notes, setNotes] = useState("");
  const [imageSource, setImageSource] = useState<ImageSource>("local");
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const found = getEntryById(id);
      setEntry(found);
      setNotes(found?.notes || "");
      setImageSource("local");
    }, [id]),
  );

  const styles = useMemo(() => createStyles(colors), [colors]);

  const imageUri =
    imageSource === "remote"
      ? entry?.coverUrl
      : entry?.localImageUri || entry?.coverUrl;

  const handleImageError = () => {
    if (imageSource === "local" && entry?.localImageUri && entry?.coverUrl) {
      setImageSource("remote");
    } else {
      setImageSource("failed");
    }
  };

  const handleRemoteImageLoad = async () => {
    if (!entry?.coverUrl) return;
    const localUri = await cacheCoverImage(entry.coverUrl);
    if (localUri && localUri !== entry.localImageUri) {
      const updated = { ...entry, localImageUri: localUri };
      saveEntry(updated);
      setEntry(updated);
    }
  };

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
          deleteEntry(id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!entry) {
    return <View style={styles.flex} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.dateHeader}>{date}</Text>

        {imageUri && imageSource !== "failed" && (
          <Image
            source={{ uri: imageUri }}
            style={styles.cover}
            resizeMode="cover"
            onError={handleImageError}
            onLoad={
              imageSource === "remote" ? handleRemoteImageLoad : undefined
            }
          />
        )}
        {imageUri && imageSource === "failed" && (
          <View style={[styles.cover, styles.imageErrorPlaceholder]}>
            <Text style={styles.imageErrorText}>{t("coverUnavailable")}</Text>
          </View>
        )}

        <Text style={styles.title}>{entry.title || t("untitled")}</Text>
        <Text style={styles.author}>{entry.author || t("unknownAuthor")}</Text>

        <Text style={styles.label}>{t("notesLabel")}</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder={t("notesPlaceholder")}
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotes}>
          <Text style={styles.saveButtonText}>{t("saveNotes")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("ScanBook", { date, id })}
        >
          <Text style={styles.secondaryButtonText}>{t("changeCover")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>{t("deleteEntry")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>["colors"]) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { padding: 20, alignItems: "center" },
    dateHeader: { fontSize: 14, color: colors.textMuted, marginBottom: 12 },
    cover: { width: 160, height: 220, borderRadius: 10, marginBottom: 16 },
    title: {
      fontSize: 20,
      fontWeight: "700",
      textAlign: "center",
      color: colors.textPrimary,
    },
    author: {
      fontSize: 15,
      color: colors.textMuted,
      marginBottom: 16,
      textAlign: "center",
    },
    label: {
      alignSelf: "flex-start",
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      marginTop: 8,
      marginBottom: 6,
    },
    notesInput: {
      width: "100%",
      minHeight: 100,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: 8,
      padding: 12,
      textAlignVertical: "top",
      marginBottom: 16,
      color: colors.textPrimary,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginBottom: 10,
    },
    saveButtonText: { color: colors.textOnImage, fontWeight: "600" },
    secondaryButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.primary,
      marginBottom: 10,
    },
    imageErrorPlaceholder: {
      backgroundColor: colors.cellBackground,
      justifyContent: "center",
      alignItems: "center",
      padding: 12,
    },
    imageErrorText: {
      fontSize: 13,
      color: colors.textMuted,
      textAlign: "center",
    },
    secondaryButtonText: { color: colors.primary, fontWeight: "600" },
    deleteButton: { paddingVertical: 10 },
    deleteButtonText: { color: colors.danger, fontWeight: "600" },
  });
}
