<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    <title>Minyan Times - Kehilas Lev V'Nefesh</title>
</head>
<body>
    <nav class="container-fluid">
        <ul>
            <li><strong>Kehilas Lev V'Nefesh</strong></li>
        </ul>
        <ul>
            <li><a href="index.php">Home</a></li>
            <li><a href="minyan-times.php">Minyan Times</a></li>
            <li><a href="index.php#about-us">About Us</a></li>
            <li><a href="contact.php">Contact</a></li>
        </ul>
    </nav>
    <main class="container">
        <h2>Minyan Times</h2>
        <p>Stay updated with our latest minyan schedules. Please note times may change for special occasions or holidays.</p>
        <?php
        // Database connection details
        $servername = "localhost";
        $username = "username";
        $password = "password";
        $dbname = "database";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // SQL query to select data from database
        $sql = "SELECT time FROM minyan_times";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Output data of each row
            while($row = $result->fetch_assoc()) {
                echo "<p>" . $row["time"]. "</p>";
            }
        } else {
            echo "No minyan times found";
        }

        $conn->close();
        ?>
    </main>
    <footer class="container">
        <small>
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Use</a>
        </small>
    </footer>
</body>
</html>