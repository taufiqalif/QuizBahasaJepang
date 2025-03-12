<?php
include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$skor = $data['skor'] ?? 0;

if (!$username || !$skor) {
    echo json_encode(['error' => 'Data tidak lengkap']);
    exit;
}

$query = "INSERT INTO leaderboard (username, skor) VALUES ('$username', '$skor')";
if (mysqli_query($conn, $query)) {
    echo json_encode(['message' => 'Skor berhasil disimpan']);
} else {
    echo json_encode(['error' => 'Gagal menyimpan skor']);
}
