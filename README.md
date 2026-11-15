# Mumu — The Creative Store · Bootstrap demo

Static, clickable demo (Bootstrap 5.3.3, no build step). All data lives in the
browser's localStorage, so orders, stock and wishlists persist per browser.
Open `index.html` (or serve the folder: `python3 -m http.server`).

## Demo logins
- **Customer:** "Continue with Google" opens a demo stand-in screen (name + Gmail prefilled).
- **Admin:** `admin/login.html` — `admin@mumu.in` / `mumu123`

To start fresh, run `Mumu.resetDemo()` in the browser console and reload.

## Shop pages
| Page | What it does |
|---|---|
| `index.html` | Hero banner, categories, most loved, gift promo, new arrivals, themes, how ordering works |
| `shop.html` | Search, category chips, price / theme / in-stock / sale / new filters, sort. `?cat=` `?tag=new` `?theme=` |
| `product.html?id=` | Product, stock state, qty capped at stock, wishlist, related. Sold out → WhatsApp "notify me" |
| `cart.html` | Qty steppers capped at stock, free-shipping bar (₹499), sold-out lines removed automatically |
| `checkout.html` | Screen 1: Google or guest. Screen 2: contact + Indian address, validation. Stock re-checked on submit |
| `order-success.html?id=` | "We will contact you soon" + order ID |
| `login.html` | Google sign-in. `?reason=wishlist&add=ID` saves the item after sign-in |
| `wishlist.html` | Needs an account (asks to sign in with Google) |
| `account.html` | My orders with progress, sign out, track order by ID + phone (guests) |

## Admin pages (`admin/`)
| Page | What it does |
|---|---|
| `index.html` | KPIs (today / 7 / 30 days), 7-day sales chart, low-stock alerts, status breakdown, sales by category, best sellers, latest orders |
| `orders.html` | Status chips, search, payment, date range, sort. Table on desktop, cards on phones |
| `order.html?id=` | WhatsApp message buttons, status/payment/tracking/private note, edit customer & address, cancel (inline confirm, stock returned), history |
| `products.html` / `product.html?id=` | Filters, add/edit product, price/MRP, stock, alert level, visibility |
| `stock.html` | Low / out of stock list with "Add stock" per row |
| `customers.html` | Grouped by WhatsApp number: orders, spent, last order, guest vs Google |

No modals anywhere — every step is its own screen or inline section.

## Moving to Django
- `assets/js/store.js` comments mark where each function becomes a view/model method.
  `placeOrder` → `transaction.atomic()` + `select_for_update()` + `F('stock') - qty`.
  Cancel/reopen stock logic is `applyStatus` in `admin/order.html`.
- Header/footer/tab bar are injected by `Mumu.shell()` / `Mumu.adminShell()`; make them `base.html` includes.
- Google sign-in: Google Identity Services / django-allauth Google provider.
- Product pictures are SVGs drawn by `assets/js/art.js`; replace with `<img>` of uploaded photos.
- Bootstrap and Bootstrap Icons are vendored in `assets/vendor/`.
