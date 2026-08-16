import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { saveEntry } from "../database/db";
import { useTranslation } from "../i18n/LanguageContext";
import { fetchBookByISBN } from "../services/booksApi";
import { colors } from "../theme/colors";
import { RootStackParamList } from "../types";

const absoluteFillObject = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

type Props = NativeStackScreenProps<RootStackParamList, "ScanBook">;

export default function ScanBookScreen({ route, navigation }: Props) {
  const { date } = route.params;
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isProcessingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const handleBarcodeScanned = async ({
    data: isbn,
  }: BarcodeScanningResult) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setScanned(true);
    setLoading(true);

    const book = await fetchBookByISBN(isbn);
    setLoading(false);

    if (book) {
      saveEntry({ date, ...book });
      Alert.alert(
        t("foundTitle"),
        `${book.title ?? t("untitled")} - ${book.author ?? t("unknownAuthor")}`,
        [
          {
            text: t("ok"),
            onPress: () => {
              isProcessingRef.current = false;
              navigation.navigate("DayDetail", { date });
            },
          },
        ],
      );
    } else {
      Alert.alert(t("notFoundTitle"), t("notFoundMessage"), [
        {
          text: t("scanAgain"),
          onPress: () => {
            isProcessingRef.current = false;
            setScanned(false);
          },
        },
        { text: t("takePhoto"), onPress: () => handleTakePhoto(isbn) },
      ]);
    }
  };

  const handleTakePhoto = async (isbn: string | null = null) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("cameraPermissionTitle"), t("cameraPermissionMessage"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      saveEntry({ date, isbn, localImageUri: result.assets[0].uri });
      navigation.navigate("DayDetail", { date });
    }
  };

  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("cameraPermissionTitle"), t("galleryPermissionMessage"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      saveEntry({ date, localImageUri: result.assets[0].uri });
      navigation.navigate("DayDetail", { date });
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>{t("cameraNeededMessage")}</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>{t("allowAccess")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        <>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8"] }}
            onBarcodeScanned={handleBarcodeScanned}
          />

          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.helperText}>{t("scanHelper")}</Text>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleTakePhoto(null)}
            >
              <Text style={styles.secondaryButtonText}>
                {t("takePhotoInstead")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePickFromGallery}
            >
              <Text style={styles.secondaryButtonText}>
                {t("pickFromGallery")}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.processingScreen}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>{t("searching")}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  infoText: { textAlign: "center", marginBottom: 16, fontSize: 15 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: colors.textOnImage, fontWeight: "600" },
  overlay: {
    ...absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 260,
    height: 160,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
  },
  helperText: { color: "#fff", marginTop: 16, fontSize: 14 },
  loadingOverlay: {
    ...absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#fff", marginTop: 12 },
  bottomBar: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  processingScreen: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
