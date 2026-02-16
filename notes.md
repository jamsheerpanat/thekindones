# The Kind Ones - Project Documentation & Notes

**Last Updated:** February 8, 2026

## 1. Project Overview
**The Kind Ones** is a modern food ordering web application built with Next.js. It features a full e-commerce flow including product browsing, cart management, secure checkout (guest & user), order tracking, and a comprehensive admin dashboard.

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (via Prisma ORM)
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js (Credentials, Google, GitHub)
- **Email:** Resend.com API
- **State Management:** React Context (Cart) + Hooks

---

## 2. Live Deployment Details
The application is currently hosted on a VPS and served via a specific IP and subpath.

- **Base URL:** `https://tko.octolabs.cloud`
- **Server IP:** `76.13.76.173`
- **Port:** `3000`
- **Subpath:** None (App runs at root domain)
- **Deployment Script:** `./deploy.sh` (Automates git push & server reload)

**Note on Nginx:**
While Nginx is installed on the server, the application is currently accessed directly via port 3000 to bypass proxy configuration issues. The internal links and redirects are hardcoded to use the IP address in `.env`.

---

## 3. Administrative Access

### Super Admin Credentials
(Created during setup - **CHANGE PASSWORDS IMMEDIATELY IF NOT DONE**)

1.  **Super Admin 1:**
    - Email: `admin@octolabs.cloud`
    - Role: `ADMIN`

2.  **Super Admin 2:**
    - Email: `jamsheerpanat@gmail.com`
    - Role: `ADMIN`

### Admin Dashboard Features (`/tko/admin`)
- **Dashboard:** Overview of sales and recent activity.
- **Menu Management:** Add/Edit/Delete food items and categories.
- **Hero Banner:** Customize the homepage main banner image and text.
- **Orders:** View and manage customer orders (status updates).
- **Users:** Manage registered users (Promote to Admin / Demote).
- **Analytics:** Basic sales reporting.
- **Settings:** System configuration.

---

## 4. Key Configurations

### Environment Variables (`.env`)
Ensure these are set on both local and server:
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="https://tko.octolabs.cloud" # IMPORTANT: Must match access URL
NEXTAUTH_SECRET="[REDACTED]"
ADMIN_EMAILS="admin@thekindones.com,admin@octolabs.cloud,jamsheerpanat@gmail.com"
RESEND_API_KEY="re_..." # Required for emails
```

### Next.js Config
The app uses a `basePath` of `/tko`. All assets, API routes, and pages are prefixed with this path automatically.
```javascript
// next.config.js
module.exports = {
  basePath: '/tko',
  // ...
}
```

---

## 5. Development & Deployment Guide

### Running Locally
```bash
npm install
npm run dev
# Access at http://localhost:3000/tko
```

### Deploying to Live Server
Use the included script to push changes and restart the server app.
```bash
./deploy.sh "Your commit message here"
# You will be prompted for the VPS password.
```

### Database Management
```bash
npx prisma studio   # GUI to view database
npx prisma generate # Regenerate client after schema changes
npx prisma migrate dev # Create migrations
```

---

## 6. Valid URLs for Third-Party Logins
If you re-enable Google/GitHub headers, ensure these Authorized Redirect URIs are set in their developer consoles:
- **Google/GitHub Callback:** `https://tko.octolabs.cloud/api/auth/callback/google` (and `github`)

---

## 7. Known Behaviors & Gotchas
- **Subpath Redirects:** Middleware and Auth redirects are sensitive to the `/tko` prefix. If a link 404s, check if the prefix is missing.
- **Email System:** Emails are sent via Resend. If emails stop working, check the API key or verify the domain if switching Sender Email.
- **Guest Checkout:** Users can checkout without an account. An account is auto-created for them with a temp password sent via email.
