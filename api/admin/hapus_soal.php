<?php
include '../config.php';
header('Content-Type: application/json');

$id = intval($_GET['id'] ?? 0);
if ($id === 0) {
  echo json_encode(['error' => 'ID tidak valid!']);
  exit;
}

$query = "DELETE FROM soal WHERE id = $id";

if (mysqli_query($conn, $query)) {
  echo json_encode(['message' => 'Soal berhasil dihapus!']);
} else {
  echo json_encode(['error' => 'Gagal menghapus soal!']);
}
