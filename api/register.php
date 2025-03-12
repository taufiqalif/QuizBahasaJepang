<?php
include 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
  echo json_encode(['error' => 'Username dan password wajib diisi!']);
  exit;
}

$username = mysqli_real_escape_string($conn, $username);
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$query = "INSERT INTO users (username, password) VALUES ('$username', '$hashedPassword')";

if (mysqli_query($conn, $query)) {
  echo json_encode(['message' => 'Registrasi berhasil!']);
} else {
  echo json_encode(['error' => 'Username sudah digunakan!']);
}
