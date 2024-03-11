<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet"  type="text/css" href="Public/Css/Styles.css">    
    <title>Kehilas Lev V'Nefesh</title>
</head>
<body>
    <nav class="container-fluid">
        <ul>
            <li><strong> Shteible Kehilas Lev V'Nefesh</strong></li>
        </ul>
        <ul class="nav-links">
            <li><a href="#minyan-times">Minyan Times</a></li>
            <li><a href="#announcements">Announcements</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    <main class="container">
        <div class="grid">
            <section id="welcome">
                <hgroup>
                    <h2>Welcome to Kehilas Lev V'Nefesh</h2>
                    <h3>Community of Heart and Soul</h3>
                </hgroup>
                <p>At Kehilas Lev V'Nefesh, we cherish the heart and soul of our community, fostering a warm and welcoming environment for all. Join us in our journey of spiritual growth and communal connection.</p>
                <figure>
                    <img src="https://source.unsplash.com/featured/?sunrise" alt="Rising Sun" />
                    <figcaption>Inspired by the warmth of the rising sun.</figcaption>
                </figure>
            </section>
        </div>
    </main>
    <section aria-label="Minyan Times and Announcements" class="container">
        <article id="minyan-times">
            <hgroup>
                <h2>Minyan Times</h2>
            </hgroup>
            <p>Stay updated with our latest minyan schedules.</p>
            <?php
           $db_host = 'localhost';
           $db_name = 'eobrmgmy_Database-1';
           $db_user = 'eobrmgmy_user_1';
           $db_pass = 'Ydavidovici35';
            // Create connection
            $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            $sql = "SELECT time FROM minyan_times";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                // output data of each row
                while($row = $result->fetch_assoc()) {
                    echo "<p>" . $row["time"]. "</p>";
                }
            } else {
                echo "No minyan times found";
            }
            $conn->close();
            ?>
        </article>
        <article id="announcements">
            <hgroup>
                <h2>Announcements</h2>
            </hgroup>
            <p>Find out what's happening in our community.</p>
            <!-- Dynamic content for announcements will go here -->
        </article>
    </section>
    <section id="about-us" class="container">
        <hgroup>
        <h2>About Us</h2> 
        </hgroup>
        <p>
            Kehilas Lev V'Nefesh is a community that cherishes the heart and soul of 
            our members. We strive to foster a warm and welcoming environment for all, 
            promoting spiritual growth and communal connection. Our community is 
            inspired by the warmth of the rising sun, symbolizing the start of a new day 
            filled with opportunities for growth and connection.
        </p>
        <p>
            Our doors are open to all who seek to join us in worship and fellowship. 
            We invite you to explore our community and join us in our journey of 
            spiritual growth and communal connection.
        </p>
    </section>
    <footer class="container">
        <small>
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Use</a>
        </small>
    </footer>
</body>
</html>
```