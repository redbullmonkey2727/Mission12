# Mission12_Foote — Online Bookstore (with Cart)

IS 413 – Hilton, Mission #12

Continues the Mission 11 bookstore. Adds category filtering, a full shopping cart,
and a Bootstrap Grid layout.

## New in Mission 12

- **Category filter sidebar** — checkbox list; page numbers adjust with the filter
- **Shopping cart** — add books, adjust quantity, see per-item subtotals and a grand total
- **sessionStorage persistence** — the cart survives navigation for the life of the browser tab
- **"Continue Shopping"** — returns the user to the same page they added from
- **Cart summary** on the book list page + live badge in the navbar
- **Bootstrap Grid** — row/col-lg-3/col-lg-9 layout

## Bootstrap features used for the first time

1. **Offcanvas** — slide-in cart drawer triggered from the navbar's Cart button.
   See `src/components/CartOffcanvas.tsx` (uses `offcanvas`, `offcanvas-end`,
   `offcanvas-header`, `offcanvas-body`, and the `data-bs-toggle="offcanvas"`
   trigger attribute on the navbar button in `App.tsx`).
2. **Toasts** — temporary "added to cart" confirmation in the bottom-right.
   See `src/components/AddToCartToast.tsx` (uses `toast-container`, `toast`,
   `text-bg-success`).

## Running locally

Backend (http://localhost:5280):
```bash
cd backend
dotnet run
```

Frontend (http://localhost:5173):
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Author

Jonathan Foote — BYU Marriott School of Business
