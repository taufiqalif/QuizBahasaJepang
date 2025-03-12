<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "quiz_jepang";

$conn = mysqli_connect($host, $user, $pass, $db);

// Pastikan koneksi
if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// Pakai UTF8MB4 biar karakter Jepang muncul
mysqli_set_charset($conn, "utf8mb4");

// Atau lebih kuat
mysqli_query($conn, "SET NAMES 'utf8mb4'");
mysqli_query($conn, "SET CHARACTER SET utf8mb4");
mysqli_query($conn, "SET SESSION collation_connection = 'utf8mb4_unicode_ci'");
