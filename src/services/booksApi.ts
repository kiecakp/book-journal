import { BookApiResult, BookFetchResult } from "../types";

export async function fetchBookByISBN(isbn: string): Promise<BookFetchResult> {
  const cleanIsbn = isbn.replace(/[^0-9Xx]/g, "");
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&jscmd=data&format=json`;

  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.error("Błąd sieci przy pobieraniu danych książki:", error);
    return { status: "network_error" };
  }

  try {
    const data = await response.json();
    const bookData = data[`ISBN:${cleanIsbn}`];

    if (!bookData) {
      return { status: "not_found" };
    }

    const book: BookApiResult = {
      isbn: cleanIsbn,
      title: bookData.title ?? null,
      author: bookData.authors
        ? bookData.authors.map((a: { name: string }) => a.name).join(", ")
        : null,
      coverUrl: bookData.cover
        ? (bookData.cover.large ??
          bookData.cover.medium ??
          bookData.cover.small)
        : null,
    };

    return { status: "found", book };
  } catch (error) {
    console.error("Błąd przetwarzania odpowiedzi Open Library:", error);
    return { status: "network_error" };
  }
}
