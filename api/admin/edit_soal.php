<?php
include '../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$id = intval($data['id'] ?? 0);
$pertanyaan = mysqli_real_escape_string($conn, $data['pertanyaan'] ?? '');
$opsi_a = mysqli_real_escape_string($conn, $data['opsi_a'] ?? '');
$opsi_b = mysqli_real_escape_string($conn, $data['opsi_b'] ?? '');
$opsi_c = mysqli_real_escape_string($conn, $data['opsi_c'] ?? '');
$jawaban_benar = mysqli_real_escape_string($conn, strtoupper($data['jawaban_benar'] ?? ''));
$tingkat = mysqli_real_escape_string($conn, strtolower($data['tingkat'] ?? ''));

if (!$id || !$pertanyaan || !$opsi_a || !$opsi_b || !$opsi_c || !$jawaban_benar || !$tingkat) {
    echo json_encode(['error' => 'Data tidak lengkap']);
    exit;
}

$query = "UPDATE soal SET 
            pertanyaan = '$pertanyaan',
            opsi_a = '$opsi_a',
            opsi_b = '$opsi_b',
            opsi_c = '$opsi_c',
            jawaban_benar = '$jawaban_benar',
            tingkat = '$tingkat'
          WHERE id = $id";

if (mysqli_query($conn, $query)) {
    echo json_encode(['message' => 'Soal berhasil diperbarui']);
} else {
    echo json_encode(['error' => 'Gagal memperbarui soal']);
}
?>
