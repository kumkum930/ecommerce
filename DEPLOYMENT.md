# Deployment Guide

A step-by-step path to getting this live.

## 1. Database — MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) for simplicity, or your backend host's IP range if you want to lock it down later.
3. Under **Database Access**, create a user with a strong password.
4. Copy the connection string (Atlas gives you a replica-set URI by default — this is required for the order transaction logic to work).

## 2. Backend — Railway or Render

Both work similarly; steps below are generic.

1. Push the `server/` folder to its own GitHub repo (or a monorepo with `server/` as the root directory for this service).
2. Create a new service, pointing it at that repo/directory.
3. Set the start command: `npm start`
4. Add all environment variables from `.env.example` in the host's dashboard — **never commit your real `.env` file**.
5. Set `CLIENT_URL` to your frontend's production URL (you'll get this in step 3) — this is required for CORS to allow requests from your deployed frontend.
6. Deploy. Note the backend's public URL (e.g. `https://your-api.up.railway.app`).

## 3. Frontend — Vercel or Netlify

1. Push `client/` to its own repo (or as a separate service in a monorepo).
2. Before deploying, point the frontend at your live backend instead of the local proxy:
   - In `client/src/api/axios.js`, change the `baseURL` to your backend's public URL (or better, use an environment variable — see below).
   - In `client/src/pages/Checkout.jsx`, set your **live/production** Stripe publishable key once you're out of test mode.
3. Recommended: use a Vite env variable instead of hardcoding the API URL.
   - Create `client/.env.production` with: `VITE_API_URL=https://your-api.up.railway.app/api`
   - Update `client/src/api/axios.js`: `baseURL: import.meta.env.VITE_API_URL || "/api"`
4. Build command: `npm run build`. Output directory: `dist`.
5. Deploy. Note the frontend's public URL, and go back to step 2.5 to set `CLIENT_URL` on the backend to match.

## 4. Stripe — go live

1. In the Stripe dashboard, switch from test to live mode.
2. Get your **live** secret key (backend `.env`) and **live** publishable key (frontend `Checkout.jsx` or an env var).
3. Stripe requires you to complete business verification before accepting live payments — do this before announcing a launch date.

## 5. Cloudinary + Resend

Both have free tiers sufficient for early-stage traffic. Just move the same API keys you used locally into your backend host's environment variables.

## 6. Post-deploy checklist

- [ ] Register a real account, promote yourself to admin in Atlas, add real products
- [ ] Place a real test order end-to-end using a [Stripe test card](https://docs.stripe.com/testing) (do this in test mode before flipping to live)
- [ ] Confirm order confirmation emails arrive
- [ ] Confirm password reset emails arrive and the reset link works
- [ ] Double check CORS: your frontend URL must exactly match `CLIENT_URL` on the backend
- [ ] Set up a custom domain on both frontend and backend if desired
- [ ] Consider a status/error monitoring tool (e.g. Sentry) before real traffic hits

## Later, once traffic grows

- Add caching (e.g. Redis) for the product listing endpoint
- Add database indexes on frequently-queried fields (`Product.category`, `Product.name` text index, `Order.user`)
- Move image uploads to a CDN-backed bucket if Cloudinary's free tier limits become a bottleneck
- Set up CI (GitHub Actions) to run the Jest test suite on every push before deploying
