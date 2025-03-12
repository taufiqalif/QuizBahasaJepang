<?php
include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$difficulty = $_GET['difficulty'] ?? 'pemula';

$query = "SELECT * FROM soal WHERE tingkat = '$difficulty' ORDER BY RAND() LIMIT 1";
$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(['error' => 'Soal tidak ditemukan']);
    exit;
}

$row = mysqli_fetch_assoc($result);
echo json_encode($row);
?>
