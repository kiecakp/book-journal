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

// Lista ekranów i parametrów jakie przyjmują - dzięki temu
// navigation.navigate('DayDetail', { date }) jest sprawdzane przez kompilator
export type RootStackParamList = {
  Calendar: undefined;
  DayDetail: { date: string };
  ScanBook: { date: string };
};
