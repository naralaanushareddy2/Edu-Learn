# EduLearn - Modern E-Learning UI

## Run locally

1. Install dependencies:
   npm install
2. Terminal 1 - start JSON Server:
   npm run server
3. Terminal 2 - start React:
   npm run dev

JSON Server runs at http://localhost:5000 and stores users/enrollments in `data/db.json`.

## Admin dashboard
Open `/admin` after logging in with an admin account from `data/db.json`.
The dashboard reads users and enrollments directly from JSON Server, so refresh shows database changes.

## Notes
- `localStorage.loggedInUser` is only used for the browser login session.
- User and enrollment records are stored in `data/db.json` and accessed with Axios.
- No MongoDB/SQL is required for this front-end submission version.
