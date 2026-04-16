// Shared type for a book record (matches backend schema).
export interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

export interface BooksResponse {
  books: Book[];
  totalBooks: number;
}
