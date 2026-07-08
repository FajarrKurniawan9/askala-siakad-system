# Askala SIAKAD System

**Sistem Informasi Akademik (SIAKAD)** untuk **SMK Telkom Malang** — ini adalah **REST API backend** yang menangani data siswa, prestasi, organisasi sekolah, ekstrakurikuler, pembayaran/tagihan, keuangan (kas organisasi), nilai/progres siswa, aktivitas, dan notifikasi.

> ⚠️ **Catatan penting:** Repository ini **hanya berisi backend (API)**. Tidak ada tampilan/frontend di dalam repo ini. Frontend-nya berjalan terpisah (terlihat dari konfigurasi CORS yang mengarah ke `https://app-askala.vercel.app`).

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Folder](#-struktur-folder)
- [Peran Pengguna & Hak Akses](#-peran-pengguna--hak-akses)
- [Model Data (Ringkasan)](#-model-data-ringkasan)
- [Persiapan Sebelum Instalasi](#-persiapan-sebelum-instalasi)
- [Cara Instalasi & Menjalankan Proyek](#-cara-instalasi--menjalankan-proyek)
- [Environment Variables](#-environment-variables)
- [Dokumentasi API (Swagger)](#-dokumentasi-api-swagger)
- [Akun Demo (Hasil Seeding)](#-akun-demo-hasil-seeding)
- [Perintah (Script) yang Tersedia](#-perintah-script-yang-tersedia)
- [Menjalankan Testing](#-menjalankan-testing)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

Askala SIAKAD System adalah backend API yang dibangun menggunakan **NestJS** untuk mengelola seluruh kebutuhan administrasi akademik dan kesiswaan di sekolah, seperti:

- Pencatatan data siswa, orang tua/wali, dan admin/guru.
- Pencatatan prestasi siswa (akademik, organisasi, non-akademik).
- Pengelolaan organisasi sekolah (OSIS, Pramuka, PMR, KIR, Paskibra, dsb).
- Pengelolaan ekstrakurikuler.
- Sistem tagihan dan pembayaran (misalnya iuran organisasi) beserta verifikasi bukti bayar.
- Pencatatan kas/keuangan organisasi (pemasukan & pengeluaran).
- Pencatatan progres nilai siswa per bulan (untuk grafik yang dilihat orang tua).
- Log aktivitas/linimasa siswa.
- Notifikasi untuk pengguna.
- Upload file (misalnya bukti bayar atau sertifikat) ke **Supabase Storage**.

## ✨ Fitur Utama

Setiap fitur di bawah ini punya modul-nya sendiri di dalam folder `src/`:

| Modul | Fungsi |
|---|---|
| `auth` | Registrasi, login (JWT), lihat profil sendiri (`/auth/me`), logout |
| `users` | Manajemen data pengguna (admin, guru, dsb) |
| `students` | Manajemen data siswa (NIS, kelas, jurusan, dsb) |
| `parents` | Manajemen data orang tua/wali dan anak-anaknya |
| `achievements` | Pencatatan & verifikasi prestasi siswa |
| `organizations` | Manajemen organisasi sekolah (OSIS, Pramuka, dll) |
| `student-organizations` | Relasi siswa ↔ organisasi beserta jabatannya (Ketua, Sekretaris, Anggota) |
| `extracurriculars` | Manajemen ekstrakurikuler |
| `bills` | Tagihan (misal iuran organisasi) yang dibuat admin |
| `submissions` | Pengajuan/upload bukti pembayaran oleh siswa, lalu diverifikasi admin |
| `treasury` | Pencatatan transaksi kas organisasi (pemasukan/pengeluaran) |
| `progress-scores` | Skor perkembangan siswa per bulan (untuk grafik orang tua) |
| `activities` | Log aktivitas/linimasa siswa |
| `notifications` | Notifikasi untuk pengguna |
| `upload` | Upload file ke Supabase Storage (bukti bayar, sertifikat, dll) |

Semua endpoint (kecuali `auth` dan `upload`) mengikuti pola **CRUD** yang konsisten: `POST` (buat), `GET` (lihat semua), `GET /:id` (lihat detail), `PATCH /:id` (ubah), `DELETE /:id` (hapus).

## 🛠 Teknologi yang Digunakan

- **[NestJS](https://nestjs.com/)** (v11) — Framework backend berbasis TypeScript.
- **[Prisma ORM](https://www.prisma.io/)** — Untuk mengakses database.
- **PostgreSQL** — Database utama (biasanya di-host lewat Supabase).
- **[Supabase Storage](https://supabase.com/storage)** — Menyimpan file yang di-upload (bukti bayar, sertifikat, dll).
- **JWT (JSON Web Token)** + **Passport** — Autentikasi & otorisasi berbasis peran (role-based).
- **class-validator** & **class-transformer** — Validasi data yang masuk ke API.
- **Swagger (OpenAPI)** — Dokumentasi API otomatis.
- **Jest** — Untuk unit test dan e2e test.

## 📂 Struktur Folder

```
askala-siakad-system/
├── prisma/
│   ├── schema.prisma       # Skema database (model, relasi, enum)
│   ├── seed.ts             # Data contoh (dummy) untuk development
│   └── migrations/         # Riwayat migrasi database
├── src/
│   ├── auth/               # Login, register, JWT, guard, decorator role
│   ├── students/           # Modul data siswa
│   ├── parents/            # Modul data orang tua
│   ├── users/              # Modul data pengguna (admin/guru)
│   ├── achievements/       # Modul prestasi siswa
│   ├── organizations/      # Modul organisasi sekolah
│   ├── student-organizations/ # Relasi siswa-organisasi
│   ├── extracurriculars/   # Modul ekstrakurikuler
│   ├── bills/              # Modul tagihan
│   ├── submissions/        # Modul pengajuan pembayaran
│   ├── treasury/           # Modul kas organisasi
│   ├── progress-scores/    # Modul skor progres siswa
│   ├── activities/         # Modul log aktivitas
│   ├── notifications/      # Modul notifikasi
│   ├── upload/             # Modul upload file (Supabase Storage)
│   ├── app.module.ts       # Modul utama yang menggabungkan semua modul
│   └── main.ts             # Entry point aplikasi (bootstrap, CORS, Swagger)
└── test/                   # Konfigurasi & file end-to-end test
```

## 👥 Peran Pengguna & Hak Akses

Sistem ini menggunakan 4 peran (`Role`), yang diatur lewat `@Roles()` decorator dan `RolesGuard`:

| Peran | Deskripsi |
|---|---|
| `ADMIN` | Akses penuh — bisa membuat, mengubah, dan menghapus hampir semua data (misalnya membuat tagihan, memverifikasi pembayaran, memverifikasi prestasi). |
| `TEACHER` | Guru. Perannya sudah didefinisikan di sistem, namun saat ini belum punya tabel profil terpisah seperti `Student`/`Parent`/`AdminProfile`. |
| `STUDENT` | Siswa — bisa melihat datanya sendiri, mengajukan prestasi, mengajukan bukti pembayaran, dsb. |
| `PARENT` | Orang tua/wali — bisa memantau data anak (prestasi, nilai, pembayaran, dll), umumnya dengan akses hanya-lihat. |

Pola umum otorisasi di sebagian besar modul:
- **Membuat/mengubah/menghapus data** → biasanya khusus `ADMIN` (beberapa modul seperti `achievements`, `students`, `activities`, `submissions` juga mengizinkan `STUDENT` untuk membuat datanya sendiri).
- **Melihat data** → biasanya terbuka untuk `ADMIN`, `STUDENT`, dan `PARENT`.

## 🗄 Model Data (Ringkasan)

Skema database (lihat `prisma/schema.prisma`) terdiri dari model-model berikut:

- **User** — Data akun (email, password, nama, peran/role, dll). Menjadi dasar untuk profil `Student`, `AdminProfile`, dan `Parent`.
- **Student** — Profil siswa (NIS, kelas, jurusan, angkatan), terhubung ke `User` dan opsional ke `Parent`.
- **Parent** — Profil orang tua, bisa punya beberapa `Student` (anak).
- **AdminProfile** — Profil admin/guru (jabatan, misal "Wakasek", "Guru BK").
- **SchoolOrg** — Organisasi sekolah (OSIS, Pramuka, dll).
- **StudentOrganization** — Relasi banyak-ke-banyak siswa dan organisasi, beserta jabatan.
- **Achievement** — Prestasi siswa (jenis, tingkat, tanggal, sertifikat, status verifikasi).
- **Extracurricular** — Data ekstrakurikuler siswa.
- **PaymentBill** — Tagihan yang dibuat admin (misalnya iuran organisasi).
- **PaymentSubmission** — Pengajuan bukti bayar oleh siswa untuk sebuah tagihan, beserta status verifikasi.
- **TreasuryTransaction** — Transaksi kas organisasi (pemasukan/pengeluaran).
- **ActivityLog** — Linimasa aktivitas siswa (prestasi, organisasi, ekskul, pembayaran, dll).
- **ProgressScore** — Skor perkembangan siswa per bulan/tahun.
- **Notification** — Notifikasi untuk pengguna.

## ✅ Persiapan Sebelum Instalasi

Pastikan sudah menyiapkan:

1. **Node.js** (disarankan versi LTS terbaru).
2. **Database PostgreSQL** — bisa pakai [Supabase](https://supabase.com/) (gratis) atau PostgreSQL lokal.
3. **Akun & Project Supabase Storage** — untuk fitur upload file (bucket bernama `siakad_files`).
4. **npm** (biasanya sudah otomatis terpasang bersama Node.js).

## 🚀 Cara Instalasi & Menjalankan Proyek

### 1. Clone repository

```bash
git clone https://github.com/FajarrKurniawan9/askala-siakad-system.git
cd askala-siakad-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

Buat file `.env` di root folder, isi sesuai [daftar environment variable](#-environment-variables) di bawah.

### 4. Jalankan migrasi database

```bash
npx prisma migrate deploy
```

> Gunakan `npx prisma migrate dev` jika sedang dalam tahap pengembangan dan ingin membuat migrasi baru.

### 5. (Opsional) Isi database dengan data contoh

```bash
npx prisma db seed
```

Perintah ini akan membuat beberapa akun contoh (admin, guru, orang tua, siswa) beserta data prestasi, organisasi, tagihan, dsb — lihat bagian [Akun Demo](#-akun-demo-hasil-seeding).

### 6. Jalankan server

```bash
# Mode development (otomatis restart saat ada perubahan kode)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

Setelah berjalan, server bisa diakses di `http://localhost:3000` (atau sesuai `PORT` di `.env`).

## 🔑 Environment Variables

Buat file `.env` di root project dengan isi berikut:

| Variabel | Wajib? | Keterangan |
|---|---|---|
| `DATABASE_URL` | ✅ Wajib | Connection string PostgreSQL (dipakai Prisma Client saat runtime, biasanya lewat connection pooler Supabase). |
| `DIRECT_URL` | ✅ Wajib | Connection string PostgreSQL langsung/direct (dipakai Prisma saat menjalankan migrasi). |
| `JWT_SECRET` | ⚠️ Sangat disarankan | Kunci rahasia untuk menandatangani token JWT. Jika tidak diisi, sistem memakai nilai bawaan yang **tidak aman untuk production**. |
| `SUPABASE_URL` | ✅ Wajib (untuk upload file) | URL project Supabase, dipakai oleh modul `upload`. |
| `SUPABASE_KEY` | ✅ Wajib (untuk upload file) | API key Supabase (service role/anon key sesuai kebutuhan), dipakai oleh modul `upload`. |
| `PORT` | ❌ Opsional | Port server. Default: `3000`. |

Contoh isi `.env`:

```env
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
JWT_SECRET="ganti-dengan-kunci-rahasia-yang-kuat"
SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
SUPABASE_KEY="isi-dengan-supabase-api-key"
PORT=3000
```

> 📌 Repo ini tidak menyertakan file `.env.example`, jadi pastikan membuatnya sendiri sesuai tabel di atas sebelum menjalankan aplikasi.

## 📑 Dokumentasi API (Swagger)

Setelah server berjalan, dokumentasi lengkap seluruh endpoint (request/response, parameter, contoh data) bisa diakses di:

```
http://localhost:3000/api-docs
```

Dokumentasi ini dibuat otomatis dengan Swagger dan mendukung autentikasi Bearer Token (JWT), jadi kamu bisa langsung mencoba endpoint yang butuh login dari halaman tersebut.

## 👤 Akun Demo (Hasil Seeding)

Jika sudah menjalankan `npx prisma db seed`, kamu bisa login menggunakan akun berikut (password sama untuk semua: **`Password123`**):

| Peran | Email |
|---|---|
| Admin | `admin@askala.id` |
| Guru | `guru@askala.id` |
| Orang tua | `ortu@askala.id` |
| Siswa (contoh) | `rina@askala.id`, `dimas@askala.id`, `putri@askala.id`, `fajar@askala.id`, `nadia@askala.id` |

> 🔒 Akun ini hanya untuk kebutuhan development/testing. **Jangan gunakan data ini di lingkungan production.**

## 📜 Perintah (Script) yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run start` | Menjalankan server (mode biasa) |
| `npm run start:dev` | Menjalankan server dengan mode watch (auto-restart) |
| `npm run start:debug` | Menjalankan server dengan mode debug + watch |
| `npm run start:prod` | Menjalankan hasil build untuk production |
| `npm run build` | Meng-compile project ke folder `dist/` |
| `npm run lint` | Menjalankan ESLint dan otomatis memperbaiki masalah yang bisa diperbaiki |
| `npm run format` | Merapikan format kode dengan Prettier |
| `npm run test` | Menjalankan unit test |
| `npm run test:watch` | Menjalankan unit test dengan mode watch |
| `npm run test:cov` | Menjalankan unit test sekaligus laporan coverage |
| `npm run test:e2e` | Menjalankan end-to-end test |

## 🧪 Menjalankan Testing

```bash
# Unit test
npm run test

# End-to-end test
npm run test:e2e

# Laporan code coverage
npm run test:cov
```

## 🤝 Kontribusi

Kontribusi sangat terbuka! Jika ingin berkontribusi:

1. Fork repository ini.
2. Buat branch baru untuk fitur/perbaikanmu (`git checkout -b fitur-baru`).
3. Commit perubahanmu (`git commit -m "Menambahkan fitur X"`).
4. Push ke branch tersebut (`git push origin fitur-baru`).
5. Buka Pull Request.

Pastikan menjalankan `npm run lint` dan `npm run format` sebelum membuat Pull Request agar gaya kode tetap konsisten.

## 📄 Lisensi

Saat ini repository berstatus **`UNLICENSED`** (belum ada lisensi terbuka yang ditetapkan pada `package.json`). Silakan hubungi pemilik repository untuk kejelasan penggunaan/lisensi lebih lanjut.

---

<p align="center">Dibuat untuk mendukung pengelolaan akademik & kesiswaan di SMK Telkom Malang 🎓</p>
