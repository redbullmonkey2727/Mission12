import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Book } from '../types/Book';

// A single line item in the cart — a book plus how many of it
export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addBook: (book: Book) => void;
  increment: (bookID: number) => void;
  decrement: (bookID: number) => void;
  remove: (bookID: number) => void;
  clear: () => void;
  totalItemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Key used for sessionStorage. sessionStorage (not localStorage) because the
// spec says the cart should persist "for the duration of the session".
const STORAGE_KEY = 'mission12_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads from sessionStorage so we hydrate on first render
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  // Write back to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / disabled — fail silently
    }
  }, [items]);

  const addBook = (book: Book) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.book.bookID === book.bookID);
      if (existing) {
        return prev.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const increment = (bookID: number) =>
    setItems((prev) =>
      prev.map((item) =>
        item.book.bookID === bookID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

  const decrement = (bookID: number) =>
    setItems((prev) =>
      prev
        .map((item) =>
          item.book.bookID === bookID
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  const remove = (bookID: number) =>
    setItems((prev) => prev.filter((item) => item.book.bookID !== bookID));

  const clear = () => setItems([]);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.book.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addBook,
        increment,
        decrement,
        remove,
        clear,
        totalItemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for components to read/modify the cart
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
