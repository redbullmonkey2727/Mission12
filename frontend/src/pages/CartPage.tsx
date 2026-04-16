import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Full-page cart view with quantity controls and totals.
 */
function CartPage() {
  const { items, increment, decrement, remove, clear, totalItemCount, totalPrice } =
    useCart();

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">🛒 Your Shopping Cart</h2>
          <Link to="/" className="btn btn-outline-primary">
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <p className="text-muted mb-3">Your cart is currently empty.</p>
              <Link to="/" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive shadow-sm rounded mb-3">
              <table className="table table-striped align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th className="text-end">Price</th>
                    <th className="text-center" style={{ width: '180px' }}>
                      Quantity
                    </th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ book, quantity }) => (
                    <tr key={book.bookID}>
                      <td className="fw-semibold">{book.title}</td>
                      <td>{book.author}</td>
                      <td className="text-end">${book.price.toFixed(2)}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => decrement(book.bookID)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span
                            className="btn btn-outline-secondary disabled"
                            style={{ minWidth: '3rem' }}
                          >
                            {quantity}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => increment(book.bookID)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-semibold">
                        ${(book.price * quantity).toFixed(2)}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(book.bookID)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan={3}></td>
                    <td className="text-end fw-semibold">Total ({totalItemCount}):</td>
                    <td className="text-end fw-bold fs-5">${totalPrice.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="d-flex gap-2">
              <Link to="/" className="btn btn-primary">
                ← Continue Shopping
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={clear}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
