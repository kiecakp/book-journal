import * as FileSystem from "expo-file-system/legacy";

const documentDirectory =
  (FileSystem as any).documentDirectory ??
  (FileSystem as any).cacheDirectory ??
  "";

const COVERS_DIR = `${documentDirectory}covers/`;

function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

async function ensureDirExists(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(COVERS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(COVERS_DIR, { intermediates: true });
  }
}

export async function cacheCoverImage(
  remoteUrl: string,
): Promise<string | null> {
  try {
    await ensureDirExists();

    const extension = remoteUrl.split(".").pop()?.split("?")[0] || "jpg";
    const fileName = `${hashUrl(remoteUrl)}.${extension}`;
    const localPath = `${COVERS_DIR}${fileName}`;

    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (fileInfo.exists) {
      return localPath;
    }

    const result = await FileSystem.downloadAsync(remoteUrl, localPath);
    return result.uri;
  } catch (error) {
    console.error("Błąd pobierania okładki do pamięci lokalnej:", error);
    return null;
  }
}

export async function deleteLocalCover(localUri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(localUri, { idempotent: true });
  } catch (error) {
    console.error("Błąd usuwania lokalnej okładki:", error);
  }
}
