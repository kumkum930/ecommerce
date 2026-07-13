# Getting Started — Absolute Beginner Guide

Follow these steps in order. Don't skip ahead — each one sets up something the next step needs.

---

## Step 1: Install the tools you need

1. **Install Node.js** — this lets your computer run the project.
   - Go to [nodejs.org](https://nodejs.org)
   - Download the "LTS" version (the button on the left)
   - Install it like any normal program (click Next, Next, Finish)

2. **Install a code editor** (so you can open and look at the project files)
   - Go to [code.visualstudio.com](https://code.visualstudio.com)
   - Download and install VS Code

That's it for tools. You don't need to install MongoDB, Stripe, etc. as programs — those are online services you'll just make free accounts on.

---

## Step 2: Unzip the project

1. Find the `mern-ecommerce.zip` file you downloaded
2. Right-click it → "Extract All" (Windows) or double-click it (Mac)
3. You'll now have a folder called `mern-ecommerce` with two folders inside: `server` and `client`

---

## Step 3: Open the project in VS Code

1. Open VS Code
2. Click **File → Open Folder**
3. Select the `mern-ecommerce` folder

You'll see the file list on the left. You don't need to edit any code yet — just follow along.

---

## Step 4: Open a terminal in VS Code

1. In VS Code, click **Terminal → New Terminal** (top menu)
2. A black/dark box appears at the bottom — this is where you'll type commands

---

## Step 5: Create your free online accounts

This project needs 4 free accounts to work. Each one gives you a "key" (like a password) that you'll paste into a settings file. Takes about 10-15 minutes total.

### 5a. MongoDB Atlas (your database — stores users, products, orders)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up (free)
2. Create a free cluster (it'll suggest this automatically — just click through with defaults)
3. When asked, create a database username and password — **write these down**
4. Under "Network Access," click "Add IP Address" → "Allow Access from Anywhere"
5. Click "Connect" → "Drivers" → copy the connection string. It looks like:
   `mongodb+srv://yourname:<password>@cluster0.xxxxx.mongodb.net/`
6. Replace `<password>` in that string with the password you wrote down. **Save this whole string somewhere** — you'll need it in Step 6.

### 5b. Stripe (handles test payments)
1. Go to [stripe.com](https://stripe.com) and sign up (free)
2. Once in the dashboard, make sure you're in **Test mode** (toggle top-right)
3. Go to **Developers → API keys**
4. Copy the **Secret key** (starts with `sk_test_`) — save it
5. Copy the **Publishable key** (starts with `pk_test_`) — save it

### 5c. Cloudinary (stores your product photos)
1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free)
2. On your dashboard, you'll see **Cloud Name**, **API Key**, **API Secret** — save all three

### 5d. Resend (sends order confirmation emails)
1. Go to [resend.com](https://resend.com) and sign up (free)
2. Go to **API Keys** → create one → save it (starts with `re_`)

---

## Step 6: Fill in your settings file (backend)

1. In VS Code's file list, open the `server` folder
2. Find the file named `.env.example`
3. Make a copy of it and rename the copy to exactly `.env` (no ".example")
   - Easiest way: right-click `.env.example` → Copy, then right-click the folder → Paste, then rename the new file to `.env`
4. Open `.env` and paste in the values you saved in Step 5, replacing the placeholder text. It should end up looking like:

```
PORT=5000
MONGO_URI=mongodb+srv://yourname:yourpassword@cluster0.xxxxx.mongodb.net/
JWT_SECRET=make_up_any_long_random_sentence_here
STRIPE_SECRET_KEY=sk_test_...(your real key)
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=...(your real value)
CLOUDINARY_API_KEY=...(your real value)
CLOUDINARY_API_SECRET=...(your real value)

RESEND_API_KEY=re_...(your real key)
EMAIL_FROM=onboarding@resend.dev

SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=adminpass123
```

`JWT_SECRET` can be any random long string you make up — it's just used internally to sign login tokens. Something like `my-super-secret-key-12345-banana` is fine.

5. Save the file (Ctrl+S / Cmd+S)

---

## Step 7: Install the backend

In the VS Code terminal, type these commands one at a time, pressing Enter after each:

```bash
cd server
npm install
```

Wait for it to finish (it downloads everything the backend needs — takes a minute or two).

---

## Step 8: Add sample products

Still in the same terminal (still inside `server`):

```bash
npm run seed
```

This creates an admin account and 6 test products for you automatically, so you're not starting from a totally empty site.

---

## Step 9: Start the backend server

Still in the same terminal:

```bash
npm run dev
```

If it worked, you'll see something like `Server running on port 5000` and `MongoDB connected`. **Leave this terminal running** — don't close it.

---

## Step 10: Start the frontend (in a NEW terminal)

1. Click the **+** icon in VS Code's terminal panel to open a second terminal
2. In this new terminal:

```bash
cd client
npm install
```

Wait for it to finish, then run:

```bash
npm run dev
```

You'll see a message with a link like `http://localhost:5173`

---

## Step 11: Open it in your browser

1. Hold Ctrl (or Cmd on Mac) and click the `http://localhost:5173` link in the terminal — or just copy it into your browser
2. You should see your ecommerce site with the 6 sample products!

---

## Step 12: Log in as admin

1. Click **Login**
2. Email: `admin@example.com`
3. Password: `adminpass123`
   (or whatever you set in `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in your `.env`)
4. You should now see an **Admin** link in the top navbar — click it to manage products and orders

---

## Step 13: Test a purchase

1. Log out of admin, register a normal customer account (or just add items to cart while logged out)
2. Add a product to your cart, go to checkout
3. Use a [Stripe test card](https://docs.stripe.com/testing): card number `4242 4242 4242 4242`, any future expiry date, any 3-digit CVC, any ZIP
4. Complete the "purchase" — it won't charge real money since you're in Stripe test mode

---

## If something doesn't work

- **"Cannot connect to MongoDB"** → double check you pasted your real password into `MONGO_URI` (not the literal word `<password>`), and that you allowed access from anywhere in Atlas Network Access
- **Frontend loads but no products show** → make sure the backend terminal (Step 9) is still running
- **Checkout doesn't work** → make sure you also pasted your Stripe **publishable** key into `client/src/pages/Checkout.jsx` (search for `pk_test_replace_with_your_key` in that file and replace it)
- **Still stuck** → copy the exact error message from the terminal and ask — that's the fastest way to figure out what's wrong

---

## Quick recap for future sessions

Every time you want to work on this again, you just need:
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2 (new terminal tab)
cd client
npm run dev
```
No need to repeat the account creation or `npm install` steps — those are one-time.
