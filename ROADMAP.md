# 🚀 ROADMAP - Quiz Bahasa Jepang 🇯🇵

> **Kolaborasi Ryuu Freedom x ChatGPT**

---

## ✅ STATUS PROYEK SAAT INI

- **Frontend:**

  - [x] `index.html` ➜ Login + Register Page (role-based)
  - [x] `game.html` ➜ Quiz Game Page (User Only)
  - [x] `admin.html` ➜ Admin Dashboard CRUD (Admin Only)

- **Backend:**

  - [x] `login.php` ➜ Autentikasi User/Admin
  - [x] `register.php` ➜ Pendaftaran User/Admin
  - [x] `logout.php` ➜ Logout & Clear Session
  - [x] `get_soal.php` ➜ Fetch soal by tingkat
  - [x] `save_score.php` ➜ Simpan skor leaderboard
  - [x] `get_leaderboard.php` ➜ Top leaderboard user
  - [x] `admin/tambah_soal.php`, `hapus_soal.php`, `get_users.php`, `edit_soal.php` ➜ CRUD Admin Soal & User

- **UI/UX:**
  - [x] Clean & Dark Theme
  - [x] Responsive Mobile/Desktop
  - [x] Admin Panel Keren + Pagination & Sorting (Max 10 baris per halaman)

---

### Catatan

mport File `sql/soal.sql` Setelah Kosongin
Lewat Terminal XAMPP (CMD Windows):
Masuk ke folder project kamu:

    cd C:\xampp\htdocs\QuizBahasaJepang

Jalankan perintah import:

    mysql -u root -p quiz_jepang < sql/soal.sql

## ✅ DATABASE SEKARANG

#### **users**

| id  | username | password | role | created_at |
| --- | -------- | -------- | ---- | ---------- |

#### **leaderboard**

| id | username | skor | tanggal |
_(Next update: tambahkan `level`/`rank` di tabel ini)_

#### **soal**

| id | pertanyaan | opsi_a | opsi_b | opsi_c | jawaban_benar | tingkat | created_at |

---

## ✨ NEXT FEATURES (Planned)

### 1. **Sistem Rank & Badge**

- Bronze → Silver → Gold → Platinum → Diamond
- Unlock **Medali/Achievement** sesuai milestone (Skor tinggi, streak benar, dll)
- Disimpan di tabel **users** (`rank`, `medali`)

### 2. **Leaderboard Live Update**

- Menggunakan **AJAX** / **WebSocket** supaya realtime

### 3. **Voice Question / Listening Mode**

- Soal berupa **Audio MP3** ➜ pengguna menjawab setelah mendengar pertanyaan
- Perlu kolom baru di tabel soal (`audio_path`)

### 4. **Soal Percakapan untuk Level Expert**

- Bentuk soal **dialog / percakapan** ➜ opsi melanjutkan / memahami maksud percakapan
- Tipe soal baru di database ➜ `tipe_soal: pilihan_ganda / percakapan`

### 5. **Duet / Multiplayer Live**

- Pemain melawan pemain lain secara **live**
- Matchmaking lobby, sync soal & waktu
- Realtime system: gunakan **WebSocket** (PHP Ratchet / NodeJS + Socket.io)

### 6. **Profile User Page**

- Statistik user (Total soal dijawab, Skor tertinggi, Rank, Medali)
- Bisa edit profil

---

## 🚀 TARGET JANGKA PENDEK

| No  | Fitur                                            | Progress |
| --- | ------------------------------------------------ | -------- |
| 1   | Tambah kolom `level` di leaderboard              | ✅       |
| 2   | Sistem Rank otomatis (skor tertentu → rank naik) | 🚧       |
| 3   | Medali/Achievement unlock system                 | ⏳       |
| 4   | Live Leaderboard (refresh otomatis)              | ⏳       |

---

## 💻 CATATAN SERVER & HOSTING

- Coba deploy **InfinityFree** (uji coba)
- Gunakan **000webhost** / **Vercel** (API di backend, frontend SPA)
- Database: **MySQL** (pastikan charset `utf8mb4`)
- Keamanan: Hash Password (✅), Admin Area Protected (✅)

---

## 🔥 KONTRIBUTOR

- **Ryuu Freedom (Taufiq Alif R)** ➜ Dev Utama & Project Owner
- **ChatGPT** ➜ AI Assistant & Code Partner
