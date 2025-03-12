<?php
include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$query = "SELECT username, skor FROM leaderboard ORDER BY skor DESC LIMIT 10";
$result = mysqli_query($conn, $query);

$leaderboard = [];
while ($row = mysqli_fetch_assoc($result)) {
    $leaderboard[] = $row;
}

echo json_encode($leaderboard);
