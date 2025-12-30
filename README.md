# Ziyad API

Panduan singkat menjalankan proyek menggunakan Docker Compose (Postgres + Node).

## Persyaratan
- Docker dan Docker Compose (v2) terpasang di mesin Anda.

## Langkah cepat
1. Bangun dan jalankan layanan (mode development):

```bash
docker compose up --build -d
```

2. Instal dependency, generate Prisma client, dan sinkronkan skema ke database (jalankan di dalam service `app`):

```bash
# jalankan di dalam kontainer app
docker compose exec app sh -c "npm install --silent && npx prisma generate && npx prisma db push"
```

Catatan:
- `npx prisma generate` membuat Prisma Client yang digunakan aplikasi.
- `npx prisma db push` menyinkronkan schema Prisma ke database (untuk workflow development). Jika Anda menggunakan migration workflow, gunakan `npx prisma migrate dev`.

## Akses
- Aplikasi: http://localhost:3000
- Postgres (host): localhost:5432 (user: `postgres`, pass: `postgres`, db: `ziyad`)

## Perintah umum
- Lihat log aplikasi:

```bash
docker compose logs -f app
```

- Hentikan & hapus container (dan network):

```bash
docker compose down
```

- Masuk shell di dalam kontainer app:

```bash
docker compose exec app sh
```

## Tips
- Jika Anda mengubah `prisma/schema.prisma`, jalankan ulang `npx prisma generate` dan `npx prisma db push` (atau migrate jika perlu).
- Untuk produksi, sebaiknya buat `Dockerfile` untuk aplikasi dan jangan mount `node_modules` dari host; bangun image yang teroptimasi untuk production.

Jika mau, saya bisa membantu memindahkan ini ke `README.md` atau mengganti file asli langsung.
