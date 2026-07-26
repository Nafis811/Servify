# Servify Migration Scaffold

This workspace holds the first Node.js + TypeScript migration pass for Servify.

## What is migrated in this phase

- Auth: login, register, logout, session storage, and current-user lookup.
- Navbar: backend-driven navigation plus auth-aware actions.
- Landing and home: hero content, feature blocks, stats, and navbar payload.
- Marketplace: product listing, category filtering, search, and product detail.
- Shared request/session helpers for the frontend.

## Structure

- `backend/` contains the Express + TypeScript API.
- `frontend/` contains the React + TypeScript UI.
- `migration-map.md` records the module-level CodeIgniter-to-Node mapping.
- `deferred-modules.md` lists the modules left for the next phase.

## Run locally

1. Start the backend.
   - `cd backend`
   - `npm install`
   - `npm run dev`
2. Start the frontend.
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Environment files.
   - Copy `backend/.env.example` to `backend/.env` if you want to override API settings.
   - Copy `frontend/.env.example` to `frontend/.env` only if the API lives somewhere other than `http://localhost:4000/api`.

## Notes

- Auth and marketplace repositories are in-memory for this migration step. That keeps the split clean while the original database layer is reattached later.
- The frontend falls back to local seed data if the backend is temporarily unavailable, so module-by-module work can continue without blocking the UI.

## Deferred for later

- Admin
- Merchant
- Reservation
- Chatbot
- Find Us
