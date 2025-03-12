<?php
include '../config.php';
header('Content-Type: application/json');

$query = "SELECT id, username, role FROM users ORDER BY id ASC";
$result = mysqli_query($conn, $query);

$users = [];
while ($row = mysqli_fetch_assoc($result)) {
  $users[] = $row;
}

echo json_encode($users);
