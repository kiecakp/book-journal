export interface BookEntry {
  date: string;
  isbn: string | null;
  title: string | null;
  author: string | null;
  coverUrl: string | null;
  localImageUri: string | null;
  notes: string | null;
  rating: number | null;
}

// Dane zwracane przez Google Book API (jeszcze bez zapisu do bazy danych)
export interface BookApiResult {
  isbn: string;
  title: string | null;
  author: string | null;
  coverUrl: string | null;
}

export type CalendarStackParamList = {
  CalendarMain: undefined;
  DayDetail: { date: string };
  ScanBook: { date: string };
};

export type RootTabParamList = {
  Library: undefined;
  CalendarTab: undefined;
  Settings: undefined;
};

// Lista stanów przy wyszukiwaniu książki
export type BookFetchResult =
  | { status: "found"; book: BookApiResult }
  | { status: "not_found" }
  | { status: "network_error" };
