import { BookApiResult } from "../types";

export async function fetchBookByISBN(
  isbn: string,
): Promise<BookApiResult | null> {
  const cleanIsbn = isbn.replace(/[^0-9Xx]/g, "");
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`;

  console.log("Zeskanowany ISBN (surowy):", isbn);
  console.log("Wyczyszczony ISBN:", cleanIsbn);
  console.log("URL zapytania:", url);

  try {
    const response = await fetch(url);
    console.log("Status odpowiedzi:", response.status);
    const data = await response.json();
    console.log("Odpowiedź z API:", JSON.stringify(data));

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
