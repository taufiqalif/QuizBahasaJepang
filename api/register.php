<?php
include 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'user'; // default user jika tidak diisi

if (!$username || !$password) {
    echo json_encode(['error' => 'Semua kolom wajib diisi!']);
    exit;
}

// Validasi role yang benar
$valid_roles = ['admin', 'user'];
if (!in_array($role, $valid_roles)) {
    echo json_encode(['error' => 'Role tidak valid!']);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $hashed_password, $role);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Registrasi berhasil!']);
} else {
    echo json_encode(['error' => 'Username sudah digunakan!']);
}
