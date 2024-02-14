<?php
session_start();

// Database configuration
$db_host = 'localhost';
$db_name = 'myDatabase';
$db_user = 'eobrmgmy_209e_cg';
$db_pass = 'Ydavidovici35';

// Connect to the database
$db = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Get the user from the database
    $stmt = $db->prepare('SELECT * FROM admins WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    // Verify the password
    if ($user && password_verify($password, $user['password'])) {
        // The passwords match, log the user in
        $_SESSION['loggedin'] = true;
        header('Location: adminUpdateTimes.php');
        exit;
    } else {
        // The passwords do not match, show an error message
        echo 'Incorrect username or password!';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Login</title>
</head>
<body>
    <form action="login.php" method="post">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username"><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password"><br>
        <input type="submit" value="Login">
    </form>
    <?php if (isset($error)): ?>
        <p><?php echo $error; ?></p>
    <?php endif; ?>
</body>
</html>