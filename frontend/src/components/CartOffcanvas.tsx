import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Slide-out cart drawer using Bootstrap's Offcanvas component.
 *
 * BOOTSTRAP FEATURE #2 NOT USED BEFORE: Offcanvas (offcanvas + backdrop).
 * Triggered from the navbar's "Cart" button via the data-bs-toggle attribute.
 * Accessibility handled natively by Bootstrap.
 */
function CartOffcanvas() {
  const { items, totalItemCount, totalPrice } = useCart();

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="cartOffcanvas"
      aria-labelledby="cartOffcanvasLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title" id="cartOffcanvasLabel">
          🛒 Your Cart
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>

      <div className="offcanvas-body">
        {items.length === 0 ? (
          <p className="text-muted text-center mt-4">Your cart is empty.</p>
        ) : (
          <>
            <ul className="list-group list-group-flush mb-3">
              {items.map(({ book, quantity }) => (
                <li
                  key={book.bookID}
                  className="list-group-item px-0 d-flex justify-content-between"
                >
                  <div>
                    <div className="fw-semibold small">{book.title}</div>
                    <small className="text-muted">
                      ${book.price.toFixed(2)} × {quantity}
                    </small>
                  </div>
                  <span className="fw-semibold">
                    ${(book.price * quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between border-top pt-3 mb-3">
              <strong>Total ({totalItemCount}):</strong>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
          </>
        )}

        <Link
          to="/cart"
          className="btn btn-primary w-100"
          data-bs-dismiss="offcanvas"
        >
          Go to Cart
        </Link>
      </div>
    </div>
  );
}

export default CartOffcanvas;
