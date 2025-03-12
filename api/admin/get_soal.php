<?php
include '../config.php';  // keluar dari folder admin, masuk config.php

header('Content-Type: application/json');

// Ambil semua soal
$query = "SELECT id, pertanyaan, tingkat FROM soal ORDER BY id ASC";
$result = mysqli_query($conn, $query);

$soalList = [];

while ($row = mysqli_fetch_assoc($result)) {
  $soalList[] = $row;
}

echo json_encode($soalList);
