<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['loggedin'])) {
    // If not, redirect them to the login page
    header('Location: login.php');
    exit;
}

// Database configuration
$db_host = 'localhost';
$db_name = 'myDatabase';
$db_user = 'eobrmgmy_209e_cg';
$db_pass = 'Ydavidovici35';

try {
    // Secure Connection to Database
    $conn = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Data Validation
    // Assuming the Minyan times are coming in as POST data
    if (!isset($_POST['minyan_times'])) {
        throw new Exception('Minyan times not provided');
    }

    $minyan_times = $_POST['minyan_times'];

    // TODO: Add more validation here depending on the structure of your Minyan times

    // Update Database
    $stmt = $conn->prepare("UPDATE your_table SET minyan_times = :minyan_times WHERE your_condition");
    $stmt->bindParam(':minyan_times', $minyan_times);
    $stmt->execute();

    // Response
    echo json_encode(['status' => 'success', 'message' => 'Minyan times updated successfully']);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Page</title>
</head>
<body>
    <h1>Admin Page</h1>
    <form action="adminUpdateTimes.php" method="post">
        <label for="minyan_times">Enter Minyan Times:</label><br>
        <textarea id="minyan_times" name="minyan_times" rows="4" cols="50"></textarea><br>
        <input type="submit" value="Update Times">
    </form>
</body>
</html>