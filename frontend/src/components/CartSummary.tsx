import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Small summary card showing cart state plus a link to view the cart.
 * Lives on the book list page per the spec.
 */
function CartSummary() {
  const { totalItemCount, totalPrice } = useCart();

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title mb-2">
          🛒 Your Cart
        </h5>
        {totalItemCount === 0 ? (
          <p className="text-muted small mb-0">Your cart is empty.</p>
        ) : (
          <>
            <p className="mb-1 small">
              <strong>{totalItemCount}</strong> item{totalItemCount === 1 ? '' : 's'}
            </p>
            <p className="mb-2 small">
              Subtotal: <strong>${totalPrice.toFixed(2)}</strong>
            </p>
            <Link to="/cart" className="btn btn-primary btn-sm w-100">
              View Cart
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default CartSummary;
