<?php
include 'config.php'; // koneksi database

header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username'] ?? '');
$skor = intval($data['skor'] ?? 0);
$level = trim($data['level'] ?? '');

// Validasi input
if (empty($username) || empty($skor) || empty($level)) {
    echo json_encode(['error' => 'Data tidak lengkap!']);
    exit;
}

// 1. Masukkan skor ke leaderboard
$stmt = $conn->prepare("INSERT INTO leaderboard (username, skor, level) VALUES (?, ?, ?)");
$stmt->bind_param("sis", $username, $skor, $level);

if (!$stmt->execute()) {
    echo json_encode(['error' => 'Gagal menyimpan skor!']);
    exit;
}

// 2. Hitung total skor user dari leaderboard
$cekTotalSkor = $conn->prepare("SELECT SUM(skor) AS total_skor FROM leaderboard WHERE username = ?");
$cekTotalSkor->bind_param("s", $username);
$cekTotalSkor->execute();
$hasilTotal = $cekTotalSkor->get_result()->fetch_assoc();

$totalSkor = intval($hasilTotal['total_skor'] ?? 0);

// 3. Tentukan rank baru user berdasarkan total skor
$newRank = 'Warrior III';
if ($totalSkor >= 100000) $newRank = 'Mythcal Imomortal';
elseif ($totalSkor >= 90000) $newRank = 'Mythcal Glory';
elseif ($totalSkor >= 80000) $newRank = 'Mythcal Honor';
elseif ($totalSkor >= 70000) $newRank = 'Mythic';
elseif ($totalSkor >= 60000) $newRank = 'Legend I';
elseif ($totalSkor >= 50000) $newRank = 'Legend II';
elseif ($totalSkor >= 40000) $newRank = 'Legend III';
elseif ($totalSkor >= 35000) $newRank = 'Legend IV';
elseif ($totalSkor >= 30000) $newRank = 'Legend V';
elseif ($totalSkor >= 25000) $newRank = 'Epik I';
elseif ($totalSkor >= 20000) $newRank = 'Epik II';
elseif ($totalSkor >= 18000) $newRank = 'Epik III';
elseif ($totalSkor >= 16000) $newRank = 'Epik IV';
elseif ($totalSkor >= 14000) $newRank = 'Epik V';
elseif ($totalSkor >= 12000) $newRank = 'Grandmaster I';
elseif ($totalSkor >= 10000) $newRank = 'Grandmaster II';
elseif ($totalSkor >= 8000) $newRank = 'Grandmaster III';
elseif ($totalSkor >= 6000) $newRank = 'Grandmaster IV';
elseif ($totalSkor >= 5000) $newRank = 'Grandmaster V';
elseif ($totalSkor >= 4000) $newRank = 'Master I';
elseif ($totalSkor >= 3000) $newRank = 'Master II';
elseif ($totalSkor >= 2000) $newRank = 'Master III';
elseif ($totalSkor >= 1000) $newRank = 'Master IV';
elseif ($totalSkor >= 500) $newRank = 'Master V';
elseif ($totalSkor >= 300) $newRank = 'Elit I';
elseif ($totalSkor >= 200) $newRank = 'Elit II';
elseif ($totalSkor >= 100) $newRank = 'Elit III';
elseif ($totalSkor >= 50) $newRank = 'Warrior I';
elseif ($totalSkor >= 25) $newRank = 'Warrior II';
else $newRank = 'Warrior III';

// DEBUGGING LOG
error_log("Updating rank for $username to $newRank with total score $totalSkor");

// 4. Update rank di tabel users
$updateRank = $conn->prepare("UPDATE users SET rank = ? WHERE username = ?");
$updateRank->bind_param("ss", $newRank, $username);

if (!$updateRank->execute()) {
    echo json_encode(['error' => 'Gagal update rank!']);
    exit;
}

// 5. Ambil medali user
$getMedali = $conn->prepare("SELECT medali FROM users WHERE username = ?");
$getMedali->bind_param("s", $username);
$getMedali->execute();
$medaliResult = $getMedali->get_result()->fetch_assoc();

$medali = json_decode($medaliResult['medali'] ?? '[]');

// 6. Tambahkan medali jika memenuhi syarat
if ($totalSkor >= 1000 && !in_array("Newbie Pro", $medali)) {
    $medali[] = "Newbie Pro";
}

if (strpos($newRank, "Legend") !== false && !in_array("Elite Player", $medali)) {
    $medali[] = "Elite Player";
}

if ($newRank === "Mythcal Imomortal" && !in_array("Ultimate Champion", $medali)) {
    $medali[] = "Ultimate Champion";
}

// 7. Update medali user
$medaliJson = json_encode($medali);
$updateMedali = $conn->prepare("UPDATE users SET medali = ? WHERE username = ?");
$updateMedali->bind_param("ss", $medaliJson, $username);

if (!$updateMedali->execute()) {
    echo json_encode(['error' => 'Gagal update medali!']);
    exit;
}

// Tutup semua statement & koneksi
$stmt->close();
$cekTotalSkor->close();
$updateRank->close();
$getMedali->close();
$updateMedali->close();
$conn->close();

// Success Response
echo json_encode([
    'message' => 'Skor dan rank berhasil diperbarui!',
    'rank' => $newRank,
    'total_skor' => $totalSkor,
    'medali' => $medali
]);
