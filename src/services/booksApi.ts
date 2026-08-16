import { BookApiResult } from "../types";

export async function fetchBookByISBN(
  isbn: string,
): Promise<BookApiResult | null> {
  const cleanIsbn = isbn.replace(/[^0-9Xx]/g, "");
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&jscmd=data&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const bookData = data[`ISBN:${cleanIsbn}`];

    if (!bookData) return null;

    return {
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
  } catch (error) {
    console.error("Error fetching book data:", error);
    return null;
  }
}
