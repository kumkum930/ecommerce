# MERN Ecommerce Starter

A full-featured ecommerce project: MongoDB, Express, React (Vite + Tailwind), Node.js.

## What's included

- **Auth**: register/login with JWT, bcrypt password hashing, input validation
- **Password reset**: forgot-password email flow with expiring tokens
- **Products**: list/search/filter/pagination, product detail, admin CRUD
- **Image uploads**: real file upload to Cloudinary from the admin product form
- **Cart**: client-side, persisted to localStorage
- **Checkout**: Stripe PaymentIntent flow + order confirmation with atomic stock decrement
- **Orders**: customer order history, admin order management, order confirmation emails
- **Admin dashboard**: overview (revenue, order count, low-stock alerts), product management, order management
- **Seed script**: sample admin user + test products
- **Tests**: Jest + Supertest coverage for auth and product APIs

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# fill in every value in .env — see below for what each service is for
npm run dev
```

You'll need accounts for:
- **MongoDB Atlas** (free tier) — your `MONGO_URI`. Required to be a replica set for the checkout transaction to work; Atlas gives you this by default.
- **Stripe** (test mode) — `STRIPE_SECRET_KEY` from the [dashboard](https://dashboard.stripe.com/test/apikeys)
- **Cloudinary** (free tier) — `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from your Cloudinary dashboard, for product image uploads
- **Resend** (free tier) — `RESEND_API_KEY` for order confirmation and password reset emails

### 2. Seed sample data

```bash
npm run seed
```

This creates an admin user (`admin@example.com` / `adminpass123` by default — override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`) and six sample products. Safe to re-run — it clears and re-inserts products each time.

### 3. Run tests

```bash
npm test
```

Point `MONGO_URI` at a separate test database first — the test suite creates and deletes real documents.

### 4. Frontend

```bash
cd client
npm install
```

In `src/pages/Checkout.jsx`, replace the placeholder with your Stripe **publishable key**:

```js
const stripePromise = loadStripe("pk_test_your_actual_key");
```

Then run:

```bash
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so both servers need to run at once (two terminals).

## Admin dashboard

Any user with `role: "admin"` sees an **Admin** link in the navbar, linking to `/admin`.

- **Overview** (`/admin`) — total revenue, total orders, low-stock products (≤5 units)
- **Products** (`/admin/products`) — paginated list, add/edit/delete, with image upload built into the form
- **Orders** (`/admin/orders`) — view all orders with customer info and line items, update order status

Non-admins (and logged-out users) who hit `/admin/*` directly are redirected home — enforced client-side via `AdminRoute`, and backed by the existing `protect` + `adminOnly` middleware on the server so the API itself is the real gate, not just the UI.

If you didn't run the seed script: register a user, then in MongoDB (Atlas UI or `mongosh`) set that user's `role` field to `"admin"`.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for a full step-by-step guide (MongoDB Atlas, Railway/Render for the backend, Vercel/Netlify for the frontend, going live with Stripe).

## What's NOT included yet

- Admin analytics beyond revenue/order count/low-stock (e.g. sales trends over time)
- Product reviews/ratings
- Wishlist / saved items
- Multi-image gallery UI on the product detail page (backend supports multiple images already)
- Guest checkout (currently requires an account)
- Refunds/cancellations via Stripe (order status can be set to "cancelled" manually, but no Stripe refund is triggered)


## Deployment suggestions

- **Frontend**: Vercel or Netlify (`npm run build`, deploy `client/dist`)
- **Backend**: Railway or Render
- **Database**: MongoDB Atlas
- Set `CLIENT_URL` in backend `.env` to your deployed frontend URL for CORS, and update the Vite proxy / API base URL for production (point `client/src/api/axios.js` at your deployed backend URL, or use an env variable).
