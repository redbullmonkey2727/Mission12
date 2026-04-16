import { useEffect, useState } from 'react';
import { Book, BooksResponse } from '../types/Book';
import { useCart } from '../context/CartContext';
import CategoryFilter from './CategoryFilter';
import CartSummary from './CartSummary';
import AddToCartToast from './AddToCartToast';

type SortDir = 'asc' | 'desc' | null;

const API_BASE = 'http://localhost:5280/api';

// Key used to remember the last page number so "Continue Shopping" can
// return the user to where they left off.
const LAST_PAGE_KEY = 'mission12_last_page';

function BookList() {
  const { addBook } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);

  // Restore last-viewed page if the user is coming back via "Continue Shopping"
  const [pageNum, setPageNum] = useState(() => {
    const saved = sessionStorage.getItem(LAST_PAGE_KEY);
    return saved ? Number(saved) : 1;
  });
  const [pageSize, setPageSize] = useState(5);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist page number to sessionStorage so we can return here from the cart
  useEffect(() => {
    sessionStorage.setItem(LAST_PAGE_KEY, String(pageNum));
  }, [pageNum]);

  // Fetch books whenever any filter / pagination input changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          pageNum: String(pageNum),
          pageSize: String(pageSize),
        });
        if (sortDir) {
          params.append('sortBy', 'title');
          params.append('sortDir', sortDir);
        }
        selectedCategories.forEach((c) => params.append('categories', c));

        const response = await fetch(`${API_BASE}/Books?${params}`);
        if (!response.ok) throw new Error(`API returned ${response.status}`);

        const data: BooksResponse = await response.json();
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load books: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageNum, pageSize, sortDir, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize));

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  };

  const toggleTitleSort = () => {
    setSortDir((prev) => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null));
    setPageNum(1);
  };

  const handleCategoryChange = (next: string[]) => {
    setSelectedCategories(next);
    setPageNum(1); // reset to first page so the user doesn't land past the end
  };

  const handleAddToCart = (book: Book) => {
    addBook(book);
    setToastMessage(`"${book.title}" added to cart.`);
  };

  const sortIndicator =
    sortDir === 'asc' ? ' ▲' : sortDir === 'desc' ? ' ▼' : '';

  return (
    <>
      {/* Bootstrap GRID — sidebar (3 cols) + content (9 cols) */}
      <div className="row g-4">
        {/* Left column: filters + cart summary */}
        <aside className="col-lg-3">
          <CartSummary />
          <CategoryFilter
            selected={selectedCategories}
            onChange={handleCategoryChange}
          />
        </aside>

        {/* Right column: book list */}
        <section className="col-lg-9">
          {/* Toolbar: page size + sort */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="pageSizeSelect" className="form-label mb-0">
                Results per page:
              </label>
              <select
                id="pageSizeSelect"
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={toggleTitleSort}
            >
              Sort by Title{sortIndicator}
            </button>
          </div>

          {loading && (
            <div className="text-center py-4 text-muted">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Loading books...
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              <div className="table-responsive shadow-sm rounded">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th
                        role="button"
                        onClick={toggleTitleSort}
                        style={{ cursor: 'pointer' }}
                        title="Click to toggle sort"
                      >
                        Title{sortIndicator}
                      </th>
                      <th>Author</th>
                      <th>Publisher</th>
                      <th>Category</th>
                      <th className="text-end">Pages</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.bookID}>
                        <td className="fw-semibold">{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td>{book.category}</td>
                        <td className="text-end">{book.pageCount}</td>
                        <td className="text-end">${book.price.toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => handleAddToCart(book)}
                          >
                            Add to Cart
                          </button>
                        </td>
                      </tr>
                    ))}
                    {books.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-3">
                          No books match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                <small className="text-muted">
                  Showing page {pageNum} of {totalPages} ({totalBooks} total book
                  {totalBooks === 1 ? '' : 's'})
                </small>
                <nav aria-label="Book list pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                        disabled={pageNum === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <li
                          key={n}
                          className={`page-item ${n === pageNum ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setPageNum(n)}
                          >
                            {n}
                          </button>
                        </li>
                      )
                    )}
                    <li
                      className={`page-item ${
                        pageNum === totalPages ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setPageNum((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={pageNum === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
        </section>
      </div>

      <AddToCartToast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </>
  );
}

export default BookList;
