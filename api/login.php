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

$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['username'] = $username;
    $_SESSION['role'] = $user['role'];

    // Balikin URL redirect di responsenya!
    $redirectUrl = ($user['role'] == 'admin') ? 'admin.html' : 'game.html';

    echo json_encode([
        'username' => $username,
        'role' => $user['role'],
        'message' => 'Login berhasil!',
        'redirect' => $redirectUrl
    ]);
} else {
    echo json_encode(['error' => 'Username atau password salah!']);
}
