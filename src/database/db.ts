import * as SQLite from "expo-sqlite";
import { BookEntry } from "../types";

const db = SQLite.openDatabaseSync("bookjournal.db");

export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS entries (
      date TEXT PRIMARY KEY NOT NULL,
      isbn TEXT,
      title TEXT,
      author TEXT,
      coverUrl TEXT,
      localImageUri TEXT,
      notes TEXT,
      rating INTEGER
    );
  `);
}

export function getAllEntries(): Record<string, BookEntry> {
  const rows = db.getAllSync<BookEntry>("SELECT * FROM entries;");
  const map: Record<string, BookEntry> = {};
  for (const row of rows) {
    map[row.date] = row;
  }
  return map;
}

export function getEntryForDate(date: string): BookEntry | null {
  const row = db.getFirstSync<BookEntry>(
    "SELECT * FROM entries WHERE date = ?;",
    [date],
  );
  return row ?? null;
}

// Partial<BookEntry> + wymagane 'date' - pozwala zapisać tylko część pól
// (np. samo localImageUri przy zdjęciu bez danych z API)
export function saveEntry(entry: Partial<BookEntry> & { date: string }): void {
  const {
    date,
    isbn = null,
    title = null,
    author = null,
    coverUrl = null,
    localImageUri = null,
    notes = null,
    rating = null,
  } = entry;

  db.runSync(
    `INSERT INTO entries (date, isbn, title, author, coverUrl, localImageUri, notes, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
      isbn = excluded.isbn,
      title = excluded.title,
      author = excluded.author,
      coverUrl = excluded.coverUrl,
      localImageUri = excluded.localImageUri,
      notes = excluded.notes,
      rating = excluded.rating
    ;`,
    [date, isbn, title, author, coverUrl, localImageUri, notes, rating],
  );
}

export function deleteEntry(date: string): void {
  db.runSync("DELETE FROM entries WHERE date = ?;", [date]);
}

export function getCachedEntriesOlderThan(cutoffDate: string): BookEntry[] {
  return db.getAllSync<BookEntry>(
    `SELECT * FROM entries
     WHERE date < ?
       AND coverUrl IS NOT NULL
       AND localImageUri IS NOT NULL;`,
    [cutoffDate],
  );
}

export function clearLocalImagePath(date: string): void {
  db.runAsync("UPDATE entries SET localImageUri = NULL WHERE date = ?;", [
    date,
  ]);
}

export function getLocalImageUrisNewerThan(cutoffDate: string): string[] {
  const rows = db.getAllSync<{ localImageUri: string }>(
    `SELECT DISTINCT localImageUri FROM entries
     WHERE date >= ? AND localImageUri IS NOT NULL;`,
    [cutoffDate],
  );
  return rows.map((r) => r.localImageUri);
}
