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

$sql = "SELECT * FROM minyan_times";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $output[] = $row;
    }
    echo json_encode($output);
} else {
    echo "0 results";
}
$conn->close();
?>