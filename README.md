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

Backend (Express + TypeScript + Prisma) dan database PostgreSQL dijalankan dengan Docker Compose (`compose.yaml`). Data disimpan di volume `pgdata`, jadi tetap ada setelah container dibuat ulang. Sejak Tugas 2, semua akses ke API lewat nginx di `http://localhost:8080`; backend dan database tidak dipublikasikan ke host.

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
```
Migrasi Prisma berjalan otomatis saat container `api` start. API tersedia lewat nginx di http://localhost:8080.

### Tes endpoint (PowerShell)
```powershell
# Tes lewat nginx: daftar produk marketplace
curl.exe http://localhost:8080/api/marketplace/products

# Tulis ke database: register customer
$body = @{ name="Tester Satu"; email="tester1@example.com"; phone="08123456789"; password="Password123"; confirmPassword="Password123" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/register -ContentType "application/json" -Body $body

# Baca dari database: login
$login = @{ email="tester1@example.com"; password="Password123" } | ConvertTo-Json
(Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/login -ContentType "application/json" -Body $login).data.user

# Verifikasi langsung di Postgres
docker compose exec db psql -U servify_user -d servify_db -c "SELECT email, nama FROM customers;"
```
Catatan: nginx membatasi laju request (rate limit), jadi jangan menjalankan tes di atas berulang-ulang dengan sangat cepat.

### Uji persistensi
```bash
docker compose down        # tanpa -v, volume tidak dihapus
docker compose up -d
```
Tunggu sekitar 15 detik, lalu jalankan lagi login dan `SELECT` di atas. Data customer masih ada. Jangan pakai `docker compose down -v` karena itu menghapus volume.

### Catatan
Dockerisasi (Dockerfile, Compose, konfigurasi nginx, `.env.example`, dan bagian README ini) dikerjakan dengan bantuan Claude (Anthropic) yang saya jalankan dan uji sendiri.


## Tugas 2: Nginx Reverse Proxy, Load Balancing, Rate Limit

Konfigurasi ada di `compose.yaml` (service `nginx`, `api` dengan 3 replica) dan `nginx/default.conf`.

### Cara menjalankan

```bash
cp .env.example .env     # isi nilainya
docker compose up -d --build
docker compose ps        # 3 container api, 1 db, 1 nginx
```

Semua akses lewat nginx: `http://localhost:8080/api/...`.
Hanya nginx yang punya `ports`. Backend (3 replica) dan database tidak dipublikasikan.

### Bukti

**Load balancing** (`X-Upstream` berganti):

```
$ 1..6 | ForEach-Object { curl.exe -s -D - -o NUL http://localhost:8080/api/marketplace/products | Select-String "HTTP/|X-Upstream"; Start-Sleep -Milliseconds 400 }
HTTP/1.1 200 OK
X-Upstream: 172.21.0.3:4000
HTTP/1.1 200 OK
X-Upstream: 172.21.0.5:4000
HTTP/1.1 200 OK
X-Upstream: 172.21.0.4:4000
HTTP/1.1 200 OK
X-Upstream: 172.21.0.3:4000
HTTP/1.1 200 OK
X-Upstream: 172.21.0.5:4000
HTTP/1.1 200 OK
X-Upstream: 172.21.0.4:4000
```

**Rate limit** (muncul 429):

```
$ 1..20 | ForEach-Object { curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:8080/api/marketplace/products }
200
200
200
200
200
200
429
429
429
200
429
429
429
429
429
429
429
429
429
429
```

**Header keamanan dan gzip:**

```
$ curl.exe -s -D - -o NUL -H "Accept-Encoding: gzip" http://localhost:8080/api/marketplace/products
HTTP/1.1 200 OK
Server: nginx/1.27.5
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
X-Upstream: 172.21.0.5:4000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Encoding: gzip
```

**Port backend lama tidak bisa diakses:**

```
$ curl.exe -v --max-time 5 http://localhost:4000/api/marketplace/products
* connect to ::1 port 4000 from :: port 61717 failed: Connection refused
* connect to 127.0.0.1 port 4000 from 0.0.0.0 port 61718 failed: Connection refused
curl: (7) Failed to connect to localhost:4000 after 6 ms: Could not connect to server
```

### Jawaban pertanyaan

**(a) Kenapa upstream perlu `zone`? Apa yang terjadi kalau dihapus?**
`zone` menaruh state upstream (daftar server, hitungan kegagalan, status) di shared memory yang dipakai semua worker process nginx. Kalau `zone` dihapus, nginx tetap berjalan, tetapi setiap worker menyimpan state upstream sendiri-sendiri. Akibatnya urutan round-robin dan penandaan server yang gagal tidak sinkron antar worker, dan fitur upstream yang mensyaratkan zone tidak bisa dipakai.

**(b) Kenapa `limit_req_status` diganti ke 429? Apa bedanya dengan bawaan nginx?**
Bawaan nginx menolak dengan 503 Service Unavailable, yang berarti server bermasalah. 429 Too Many Requests menyatakan klien terlalu sering mengirim request, sehingga klien dan monitoring bisa membedakan pembatasan laju dari server yang benar-benar down.

**(c) Kenapa backend dan database tidak punya `ports`, dan nginx menjangkau backend lewat apa?**
Tanpa `ports`, container tidak dipublikasikan ke host dan hanya bisa dijangkau dari jaringan Compose, sehingga semua trafik wajib lewat nginx (yang menerapkan rate limit dan header keamanan) dan permukaan serangan berkurang. Nginx menjangkau backend lewat jaringan default Compose memakai nama service `api:4000`, yang di-resolve DNS internal Docker ke ketiga replica.