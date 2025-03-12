# 🇯🇵 Quiz Bahasa Jepang - Web App 🎌

> **Dibangun oleh:** Taufiq Alif R bersama ChatGPT 🤖  
> **Proyek Kolaborasi Manusia & AI** ✨

---

## 🎯 Deskripsi Proyek

**Quiz Bahasa Jepang** adalah aplikasi kuis edukasi berbasis **Web** yang dirancang untuk membantu pengguna belajar **Bahasa Jepang** secara menyenangkan dan interaktif.  
Tingkatkan pemahaman tentang **Kanji**, **Hiragana**, **Katakana**, dan **Kosakata** melalui pertanyaan-pertanyaan yang disusun berdasarkan **tingkat kesulitan**, mulai dari **Pemula** hingga **Sulit**.

Proyek ini adalah hasil **kolaborasi manusia dan AI**, di mana ide, logika, dan pengembangan dipadukan secara harmonis oleh **Taufiq Alif R** dan **ChatGPT**, menciptakan sebuah aplikasi edukasi yang modern dan fungsional.

---

## 🚀 Fitur Utama

✅ **Login Simple** (username tanpa password)  
✅ **Level Kesulitan Dinamis**: Pemula, Mudah, Sedang, Sulit  
✅ **Soal Acak dengan Timer** ➜ Waktu semakin menantang di level lebih tinggi  
✅ **Scoreboard / Leaderboard Real-Time** ➜ Top 10 Player  
✅ **Audio Feedback**: Benar ✔️, Salah ❌, Game Over ☠️ (Optional)  
✅ **Responsive UI** ➜ Mobile & Desktop Friendly  
✅ **Kolaborasi Manusia & AI** ➜ Taufiq Alif R x ChatGPT

---

## ⚙️ Teknologi yang Digunakan

- **Frontend:**  
  `HTML5`, `CSS3` (Flexbox + Grid), `JavaScript (Vanilla JS)`
- **Backend:**  
  `PHP 8+` (Native)
- **Database:**  
  `MySQL / MariaDB` ➜ UTF8MB4 untuk support Kanji & Kana
- **Fitur Tambahan (Optional):**  
  🎧 `Audio Feedback` ➜ Format `.mp3`  
  🎨 `Animasi Ringan` ➜ CSS Animation

---

## 📂 Struktur Folder Proyek

QuizBahasaJepang/ ├── api/ # Backend PHP │ ├── config.php │ ├── get_soal.php │ ├── save_score.php │ └── get_leaderboard.php ├── assets/ # File media (opsional) │ └── sound/ # Audio feedback (benar, salah, gameover) ├── css/ │ └── style.css ├── js/ │ ├── login.js │ └── script.js ├── sql/ # Folder SQL (di-ignore Git) │ └── soal.sql ├── index.html # Halaman Login ├── game.html # Halaman Utama Quiz └── README.md

---

## 🛠️ Cara Install & Menjalankan Proyek

### 1. Clone Repository

bash
git clone https://github.com/username/QuizBahasaJepang.git
cd QuizBahasaJepang

2. Setup Database
   Buka phpMyAdmin atau MySQL Command Line

Import file SQL:

    ✅ Via phpMyAdmin ➜ Import ➜ sql/soal.sql
    ✅ Via Terminal:

      mysql -u root -p quiz_jepang < sql/soal.sql

3.  Konfigurasi Database di `api/config.php`
    Pastikan settingan `host`, `user`, `password`, `database` sudah sesuai.

        $host = "localhost";
        $user = "root";
        $pass = "";
        $db = "quiz_jepang";

Dan pastikan karakter encoding sudah support UTF8MB4:

      mysqli_query($conn, "SET NAMES 'utf8mb4'");
      mysqli_query($conn, "SET CHARACTER SET utf8mb4");
      mysqli_query($conn, "SET SESSION collation_connection = 'utf8mb4_unicode_ci'");

4. Jalankan di Localhost
   Buka XAMPP / Laragon / Local Server
   Aktifkan Apache & MySQL
   Akses di browser:

   http://localhost/QuizBahasaJepang/index.html

🔒 Exclude Folder `sql/` dari GitHub (Security Best Practice)
Buat file `.gitignore` di root folder project:

      # Abaikan folder sql
      sql/

Jika folder sudah pernah di-push:

      git rm -r --cached sql
      git commit -m "Exclude folder sql from repo"

🤝 Kolaborasi Manusia & AI

🧠 Taufiq Alif R ➜ Ide, Struktur Database, Logika Game

🤖 ChatGPT (OpenAI) ➜ Optimalisasi Kode, Refactor, UI Enhancement

🎯 Hasil: Sebuah Aplikasi Quiz Bahasa Jepang Interaktif, mudah digunakan & efisien!

📜 Lisensi
MIT License © 2025
Taufiq Alif R x ChatGPT

---

    ✅ Sudah komplit bro!
    📌 Jangan lupa edit bagian `https://github.com/username/QuizBahasaJepang.git` sesuai username repo lo di GitHub.

    Kalau mau nambahin **preview gambar**, **badges**, atau **demo video**, tinggal kasih tau, nanti kita tambahin!
