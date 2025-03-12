<?php
session_start();
include 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(['error' => 'Username dan password wajib diisi!']);
    exit;
}

// Gunakan prepared statement (lebih aman)
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    // Simpan di session jika perlu
    $_SESSION['username'] = $username;
    $_SESSION['role'] = $user['role']; // Simpan role juga

    // Kirim ke frontend username & role
    echo json_encode([
        'username' => $username,
        'role' => $user['role'],   // admin / user
        'message' => 'Login berhasil!'
    ]);
} else {
    echo json_encode(['error' => 'Username atau password salah!']);
}
