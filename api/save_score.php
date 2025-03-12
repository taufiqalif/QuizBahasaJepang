<?php
include 'config.php'; // Koneksi database

header('Content-Type: application/json; charset=utf-8');

// Ambil data dari request body (JSON)
$data = json_decode(file_get_contents('php://input'), true);

// Ambil variabel dari JSON
$username = trim($data['username'] ?? '');
$skor = intval($data['skor'] ?? 0);
$level = trim($data['level'] ?? '');

// Validasi input
if (!$username || !$skor || !$level) {
    echo json_encode(['error' => 'Data tidak lengkap!']);
    exit;
}

// Masukkan skor baru ke leaderboard
$stmt = $conn->prepare("INSERT INTO leaderboard (username, skor, level) VALUES (?, ?, ?)");
$stmt->bind_param("sis", $username, $skor, $level);

if (!$stmt->execute()) {
    echo json_encode(['error' => 'Gagal menyimpan skor!']);
    exit;
}

// Hitung total skor user dari seluruh skor di leaderboard
$cekTotalSkor = $conn->prepare("SELECT SUM(skor) AS total_skor FROM leaderboard WHERE username = ?");
$cekTotalSkor->bind_param("s", $username);
$cekTotalSkor->execute();
$hasilTotal = $cekTotalSkor->get_result()->fetch_assoc();

$totalSkor = $hasilTotal['total_skor'] ?? 0;

// Tentukan rank user sesuai total skor
$newRank = 'Bronze';
if ($totalSkor >= 5000) {
    $newRank = 'Diamond';
} elseif ($totalSkor >= 2000) {
    $newRank = 'Platinum';
} elseif ($totalSkor >= 1000) {
    $newRank = 'Gold';
} elseif ($totalSkor >= 500) {
    $newRank = 'Silver';
}

// Update rank user di tabel users
$updateRank = $conn->prepare("UPDATE users SET rank = ? WHERE username = ?");
$updateRank->bind_param("ss", $newRank, $username);
$updateRank->execute();

// Ambil medali yang sudah dimiliki user
$getMedali = $conn->prepare("SELECT medali FROM users WHERE username = ?");
$getMedali->bind_param("s", $username);
$getMedali->execute();
$medaliResult = $getMedali->get_result()->fetch_assoc();

// Jika belum ada, buat array kosong
$medali = json_decode($medaliResult['medali'] ?? '[]');

// Cek dan tambahkan achievement baru
if ($totalSkor >= 1000 && !in_array("Newbie Pro", $medali)) {
    $medali[] = "Newbie Pro";
}
if ($newRank === "Platinum" && !in_array("Elite Player", $medali)) {
    $medali[] = "Elite Player";
}
if ($newRank === "Diamond" && !in_array("Ultimate Champion", $medali)) {
    $medali[] = "Ultimate Champion";
}

// Simpan medali user ke tabel users
$medaliJson = json_encode($medali);
$updateMedali = $conn->prepare("UPDATE users SET medali = ? WHERE username = ?");
$updateMedali->bind_param("ss", $medaliJson, $username);
$updateMedali->execute();

// Tutup koneksi dan statement
$stmt->close();
$cekTotalSkor->close();
$updateRank->close();
$getMedali->close();
$updateMedali->close();
$conn->close();

// Kirim respon sukses
echo json_encode([
    'message' => 'Skor berhasil disimpan!',
    'rank' => $newRank,
    'total_skor' => $totalSkor,
    'medali' => $medali
]);
