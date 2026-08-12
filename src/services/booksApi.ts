import { BookApiResult } from "../types";

export async function fetchBookByISBN(
  isbn: string,
): Promise<BookApiResult | null> {
  const cleanIsbn = isbn.replace(/[^0-9Xx]/g, "");
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) return null;

    const info = data.items[0].volumeInfo;

    return {
      isbn: cleanIsbn,
      title: info.title ?? null,
      author: info.authors ? info.authors.join(", ") : null,
      coverUrl: info.imageLinks
        ? (info.imageLinks.thumbnail ?? info.imageLinks.smallThumbnail).replace(
            "http://",
            "https://",
          )
        : null,
    };
  } catch (error) {
    console.error("Error fetching book data:", error);
    return null;
  }
}
