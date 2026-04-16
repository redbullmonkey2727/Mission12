import { useEffect, useState } from 'react';

interface Props {
  message: string | null;
  onDismiss: () => void;
}

/**
 * Bootstrap Toast displayed in the bottom-right corner when a book is
 * added to the cart. Auto-dismisses after 2 seconds.
 *
 * BOOTSTRAP FEATURE #1 NOT USED BEFORE: Toasts (toast-container + toast).
 */
function AddToCartToast({ message, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Let the fade-out animation play briefly before clearing the message
        setTimeout(onDismiss, 200);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      <div
        className={`toast align-items-center text-bg-success border-0 ${
          visible ? 'show' : 'hide'
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">✓ {message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={() => {
              setVisible(false);
              setTimeout(onDismiss, 200);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AddToCartToast;
