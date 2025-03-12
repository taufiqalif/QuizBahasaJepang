<?php
include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';

if (!$username) {
    echo json_encode(['error' => 'Username kosong']);
    exit;
}

echo json_encode(['message' => 'Login berhasil', 'username' => $username]);
