<?php
include '../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$pertanyaan = mysqli_real_escape_string($conn, $data['pertanyaan']);
$opsi_a = mysqli_real_escape_string($conn, $data['opsi_a']);
$opsi_b = mysqli_real_escape_string($conn, $data['opsi_b']);
$opsi_c = mysqli_real_escape_string($conn, $data['opsi_c']);
$jawaban_benar = strtoupper($data['jawaban_benar']);
$tingkat = strtolower($data['tingkat']);

if (!$pertanyaan || !$opsi_a || !$opsi_b || !$opsi_c || !$jawaban_benar || !$tingkat) {
    echo json_encode(['error' => 'Semua field wajib diisi!']);
    exit;
}

$query = "INSERT INTO soal (pertanyaan, opsi_a, opsi_b, opsi_c, jawaban_benar, tingkat)
          VALUES ('$pertanyaan', '$opsi_a', '$opsi_b', '$opsi_c', '$jawaban_benar', '$tingkat')";

if (mysqli_query($conn, $query)) {
    echo json_encode(['message' => 'Soal berhasil ditambahkan!']);
} else {
    echo json_encode(['error' => 'Gagal menambah soal!']);
}
