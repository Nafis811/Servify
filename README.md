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


## Menjalankan dengan Docker

Backend (Express + TypeScript + Prisma) dan database PostgreSQL bisa dijalankan dengan Docker Compose. Data disimpan di volume `pgdata`, jadi tetap ada setelah container dibuat ulang.

### Prasyarat
- Docker Desktop (Docker Compose v2)

### Setup
```bash
cp .env.example .env      # Windows PowerShell: copy .env.example .env
```
Isi `DB_PASSWORD`, `JWT_SECRET`, dan `JWT_REFRESH_SECRET` di `.env` dengan nilai sendiri (password hanya huruf dan angka). Variabel Groq dan Supabase boleh dummy untuk menguji API dan database.

### Build dan run
```bash
docker compose up -d --build
docker compose ps
docker compose logs api --tail 30
```
Migrasi Prisma berjalan otomatis saat container `api` start. API tersedia di http://localhost:4000.

### Tes endpoint (PowerShell)
```powershell
# Health check
curl.exe http://localhost:4000/api/health

# Tulis ke database: register customer
$body = @{ name="Tester Satu"; email="tester1@example.com"; phone="08123456789"; password="Password123"; confirmPassword="Password123" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/auth/register -ContentType "application/json" -Body $body

# Baca dari database: login
$login = @{ email="tester1@example.com"; password="Password123" } | ConvertTo-Json
(Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/auth/login -ContentType "application/json" -Body $login).data.user

# Verifikasi langsung di Postgres
docker compose exec db psql -U servify_user -d servify_db -c "SELECT email, nama FROM customers;"
```

### Uji persistensi
```bash
docker compose down        # tanpa -v, volume tidak dihapus
docker compose up -d
```
Tunggu sekitar 15 detik, lalu jalankan lagi login dan `SELECT` di atas. Data customer masih ada. Jangan pakai `docker compose down -v` karena itu menghapus volume.

### Catatan
Dockerisasi (Dockerfile, `docker-compose.yml`, `.env.example`, dan bagian README ini) dikerjakan untuk Tugas 1 Back-End Intermediate, dengan bantuan Claude (Anthropic) yang saya jalankan dan uji sendiri.