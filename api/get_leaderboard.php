<?php
include 'config.php'; // Koneksi database

header('Content-Type: application/json; charset=utf-8');

// Ambil data leaderboard + rank user (10 besar)
$query = "
    SELECT 
        l.username,
        SUM(l.skor) AS total_skor,
        u.rank, u.medali
    FROM leaderboard l
    JOIN users u ON l.username = u.username
    GROUP BY l.username
    ORDER BY total_skor DESC
    LIMIT 10
";

$result = $conn->query($query);

// Cek hasilnya
$leaderboard = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = [
            'username' => $row['username'],
            'total_skor' => (int)$row['total_skor'],
            'rank' => $row['rank'],
            'medali' => $row['medali']
        ];
    }

    echo json_encode($leaderboard);
} else {
    echo json_encode(['message' => 'Leaderboard kosong!']);
}

$conn->close();
