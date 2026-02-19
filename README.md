# JobPilot — Job Portal (Employer)

Next.js + Express + MongoDB Atlas.

## How to run

1. **Environment:** Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`.

2. **Server** (API, port 5000):
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Client** (Next.js, port 3000) — in a second terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login` by default.
