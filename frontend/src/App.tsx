import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import CartPage from './pages/CartPage';
import CartOffcanvas from './components/CartOffcanvas';
import { CartProvider, useCart } from './context/CartContext';

/**
 * Navbar with cart button that opens the offcanvas drawer.
 * Kept inline so it can use the useCart hook for the badge count.
 */
function NavBar() {
  const { totalItemCount } = useCart();

  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand">
          📚 The Online Bookstore
        </Link>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-light position-relative"
            data-bs-toggle="offcanvas"
            data-bs-target="#cartOffcanvas"
            aria-controls="cartOffcanvas"
          >
            🛒 Cart
            {totalItemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalItemCount}
                <span className="visually-hidden">items in cart</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <NavBar />

        <main className="container py-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>

        <footer className="bg-dark text-secondary text-center py-3 mt-5">
          <small>
            &copy; {new Date().getFullYear()} Mission 12 — Jonathan Foote, IS 413
          </small>
        </footer>

        {/* Offcanvas mounted at the root so it's available from any route */}
        <CartOffcanvas />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
