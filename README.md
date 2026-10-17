# Student Placement Management System

A small React, Express, and SQLite CRUD app for practicing database basics. The SQL statements are written by hand in [`backend/db.js`](./backend/db.js); no ORM or query builder is used.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Vite frontend and Express API:

   ```bash
   npm run dev
   ```

3. Open the local URL printed by Vite (usually <http://localhost:5173>).

The API listens on <http://localhost:3001>. Vite forwards `/api` requests to it. When the API starts, `sql.js` creates `backend/students.sqlite` and sets up the `students` table if it does not already exist. Look for the file inside the `backend` folder (the spelling is `students.sqlite`). The local SQLite file is ignored by Git.

To run only the API, use `npm run dev:server`. To build the frontend, use `npm run build`.

## Database and API

The database setup and readable `CREATE`, `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements are in `backend/db.js`. All values supplied by users are bound as SQL parameters.

The Express API in `backend/app.js` provides:

- `GET /api/students` — list student records
- `POST /api/students` — create a record
- `PUT /api/students/:id` — update a record
- `DELETE /api/students/:id` — delete a record
- `DELETE /api/students` — clear all records and keep the table

Each record has a name, email, course, graduation year, placement status, and optional company name.

## Deploy to Vercel

Import this project into Vercel and use the default project settings. The root `vercel.json` builds the Vite site into `dist`; the catch-all serverless function in `api/[...path].js` sends `/api/*` requests to the Express routes.

**SQLite storage on Vercel is temporary.** The function writes its `sql.js` database to `/tmp`, which is writable but ephemeral. Serverless instances can be restarted or scaled independently, so records may disappear and separate requests may not see the same database. Do not use this SQLite setup for persistent production data. A hosted deployment that needs reliable persistence should use a managed database service with durable storage; this learning project intentionally does not add that extra setup.
