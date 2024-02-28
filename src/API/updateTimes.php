<?php
$db_host = 'localhost';
$db_name = 'eobrmgmy_Database-1';
$db_user = 'eobrmgmy_user_1';
$db_pass = 'Ydavidovici35';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get id and times from request
$id = $_POST['id'];
$times = $_POST['times'];

$sql = "UPDATE minyan_times SET times = ? WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $times, $id);

if ($stmt->execute()) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $stmt->error;
}

$conn->close();
?>