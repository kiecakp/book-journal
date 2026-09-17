import {
  clearLocalImagePath,
  getCachedEntriesOlderThan,
  getLocalImageUrisNewerThan,
} from "../database/db";
import { deleteLocalCover } from "./imageCache";

const RETENTION_MONTHS = 12;

function getCutoffDateString(): string {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);
  return cutoff.toISOString().split("T")[0];
}

export async function cleanupOldCoverCache(): Promise<void> {
  const cutoffDate = getCutoffDateString();
  const oldEntries = getCachedEntriesOlderThan(cutoffDate);

  if (oldEntries.length === 0) return;

  const stillNeededUris = new Set(getLocalImageUrisNewerThan(cutoffDate));

  let deletedCount = 0;

  for (const entry of oldEntries) {
    if (entry.localImageUri && !stillNeededUris.has(entry.localImageUri)) {
      await deleteLocalCover(entry.localImageUri);
      deletedCount++;
    }
    clearLocalImagePath(entry.id);
  }

  if (deletedCount > 0) {
    console.log(
      `Usunięto ${deletedCount} plików okładek starszych niż ${RETENTION_MONTHS} miesięcy (bez naruszania współdzielonych plików).`,
    );
  }
}
