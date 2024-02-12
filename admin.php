<?php
// Start the session
session_start();

// Check if the user is logged in, if not then redirect to login page
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

// Database connection details
$db_host = 'localhost';
$db_user = 'root';
$db_password = 'root';
$db_name = 'admin_db';

// Create a new database connection
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// Check if the database connection was successful
if ($conn->connect_error) {
    die('Database connection error: ' . $conn->connect_error);
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the new minyan time from the form
    $time = $_POST['time'];

    // SQL query to update the minyan time
    // This assumes you have a table named 'minyanim' with columns 'id' and 'time'
    $sql = "UPDATE minyanim SET time = ? WHERE id = 1";
    $stmt = $conn->prepare($sql);
    // Bind the new minyan time to the SQL query
    $stmt->bind_param('s', $time);
    // Execute the SQL query
    $stmt->execute();

    // Message to display if the minyan time was updated successfully
    $success = 'Minyan time updated successfully';
}
?>
<!-- Rest of your HTML code -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    <title>Admin - Kehilas Lev V'Nefesh</title>
</head>
<body>
    <nav class="container-fluid">
        <ul>
            <li><strong>Kehilas Lev V'Nefesh - Admin</strong></li>
        </ul>
        <ul>
            <li><a href="index.php">Home</a></li>
        </ul>
    </nav>
    <main class="container">
        <h2>Update Minyan Times</h2>
        <form action="admin.php" method="post">
            <label for="time">New Minyan Time:</label><br>
            <input type="text" id="time" name="time"><br>
            <input type="submit" value="Update">
        </form>
        <?php if (isset($success)): ?>
            <p><?php echo $success; ?></p>
        <?php endif; ?>
    </main>
    <footer class="container">
        <small>
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Use</a>
        </small>
    </footer>
</body>
</html>