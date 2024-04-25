USE kehilas_lev_vnefesh_dev;

CREATE TABLE IF NOT EXISTS minyan_times (
id INT AUTO_INCREMENT PRIMARY KEY,
day VARCHAR(255) NOT NULL,
time VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS announcements (
id INT AUTO_INCREMENT PRIMARY KEY,
header VARCHAR(255) NOT NULL,
text TEXT NOT NULL,
date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file_uploads (
id INT AUTO_INCREMENT PRIMARY KEY,
original_name VARCHAR(255) NOT NULL,
file_data MEDIUMBLOB NOT NULL,
upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pictures (
id INT AUTO_INCREMENT PRIMARY KEY,
picture_name VARCHAR(255) NOT NULL,
picture_data MEDIUMBLOB NOT NULL,
upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
id INT AUTO_INCREMENT PRIMARY KEY,
donor_name VARCHAR(255) NOT NULL,
amount DECIMAL(10,2) NOT NULL,
donation_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS sponsors (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
contact_info TEXT NOT NULL,
sponsorship_id INT,
amount_paid DECIMAL(10,2),
date_paid DATE
);

CREATE TABLE IF NOT EXISTS available_sponsorships (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS parnes_sponsorships (
id INT AUTO_INCREMENT PRIMARY KEY,
type ENUM('monthly', 'weekly') NOT NULL,  -- 'monthly' for Parnes HaChodesh, 'weekly' for Parnes HaShavuah
title VARCHAR(255) NOT NULL,
description TEXT
);

CREATE TABLE IF NOT EXISTS kiddush_sponsorships (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT
);

CREATE TABLE IF NOT EXISTS sponsorship_records (
id INT AUTO_INCREMENT PRIMARY KEY,
sponsorship_id INT NOT NULL,
sponsor_id INT NOT NULL,
sponsorship_type ENUM('parnes', 'kiddush') NOT NULL,
comments TEXT,
FOREIGN KEY (sponsor_id) REFERENCES sponsors(id),
FOREIGN KEY (sponsorship_id)
    REFERENCES parnes_sponsorships(id) -- Assuming no conflicts in IDs between tables; otherwise, adjust the design.
);

INSERT INTO kiddush_sponsorships (title, description) VALUES
                                                          ('Kiddush Bereishis', 'Kiddush sponsorship for Parshas Bereishis'),
                                                          ('Kiddush Noach', 'Kiddush sponsorship for Parshas Noach'),
                                                          ('Kiddush Lech Lecha', 'Kiddush sponsorship for Parshas Lech Lecha'),
                                                          ('Kiddush Vayera', 'Kiddush sponsorship for Parshas Vayera'),
                                                          ('Kiddush Chayei Sarah', 'Kiddush sponsorship for Parshas Chayei Sarah'),
                                                          ('Kiddush Toldos', 'Kiddush sponsorship for Parshas Toldos'),
                                                          ('Kiddush Vayetze', 'Kiddush sponsorship for Parshas Vayetze'),
                                                          ('Kiddush Vayishlach', 'Kiddush sponsorship for Parshas Vayishlach'),
                                                          ('Kiddush Vayeshev', 'Kiddush sponsorship for Parshas Vayeshev'),
                                                          ('Kiddush Miketz', 'Kiddush sponsorship for Parshas Miketz'),
                                                          ('Kiddush Vayigash', 'Kiddush sponsorship for Parshas Vayigash'),
                                                          ('Kiddush Vayechi', 'Kiddush sponsorship for Parshas Vayechi'),
                                                          ('Kiddush Shemos', 'Kiddush sponsorship for Parshas Shemos'),
                                                          ('Kiddush Vaera', 'Kiddush sponsorship for Parshas Vaera'),
                                                          ('Kiddush Bo', 'Kiddush sponsorship for Parshas Bo'),
                                                          ('Kiddush Beshalach', 'Kiddush sponsorship for Parshas Beshalach'),
                                                          ('Kiddush Yisro', 'Kiddush sponsorship for Parshas Yisro'),
                                                          ('Kiddush Mishpatim', 'Kiddush sponsorship for Parshas Mishpatim'),
                                                          ('Kiddush Terumah', 'Kiddush sponsorship for Parshas Terumah'),
                                                          ('Kiddush Tetzaveh', 'Kiddush sponsorship for Parshas Tetzaveh'),
                                                          ('Kiddush Ki Sisa', 'Kiddush sponsorship for Parshas Ki Sisa'),
                                                          ('Kiddush Vayakhel', 'Kiddush sponsorship for Parshas Vayakhel'),
                                                          ('Kiddush Pekudei', 'Kiddush sponsorship for Parshas Pekudei'),
                                                          ('Kiddush Vayikra', 'Kiddush sponsorship for Parshas Vayikra'),
                                                          ('Kiddush Tzav', 'Kiddush sponsorship for Parshas Tzav'),
                                                          ('Kiddush Shmini', 'Kiddush sponsorship for Parshas Shmini'),
                                                          ('Kiddush Tazria', 'Kiddush sponsorship for Parshas Tazria'),
                                                          ('Kiddush Metzora', 'Kiddush sponsorship for Parshas Metzora'),
                                                          ('Kiddush Acharei Mos', 'Kiddush sponsorship for Parshas Acharei Mos'),
                                                          ('Kiddush Kedoshim', 'Kiddush sponsorship for Parshas Kedoshim'),
                                                          ('Kiddush Emor', 'Kiddush sponsorship for Parshas Emor'),
                                                          ('Kiddush Behar', 'Kiddush sponsorship for Parshas Behar'),
                                                          ('Kiddush Bechukosai', 'Kiddush sponsorship for Parshas Bechukosai'),
                                                          ('Kiddush Bamidbar', 'Kiddush sponsorship for Parshas Bamidbar'),
                                                          ('Kiddush Naso', 'Kiddush sponsorship for Parshas Naso'),
                                                          ('Kiddush Behaalosecha', 'Kiddush sponsorship for Parshas Behaalosecha'),
                                                          ('Kiddush Shlach', 'Kiddush sponsorship for Parshas Shlach'),
                                                          ('Kiddush Korach', 'Kiddush sponsorship for Parshas Korach'),
                                                          ('Kiddush Chukas', 'Kiddush sponsorship for Parshas Chukas'),
                                                          ('Kiddush Balak', 'Kiddush sponsorship for Parshas Balak'),
                                                          ('Kiddush Pinchas', 'Kiddush sponsorship for Parshas Pinchas'),
                                                          ('Kiddush Matos', 'Kiddush sponsorship for Parshas Matos'),
                                                          ('Kiddush Masei', 'Kiddush sponsorship for Parshas Masei'),
                                                          ('Kiddush Devarim', 'Kiddush sponsorship for Parshas Devarim'),
                                                          ('Kiddush Vaeschanan', 'Kiddush sponsorship for Parshas Vaeschanan'),
                                                          ('Kiddush Eikev', 'Kiddush sponsorship for Parshas Eikev'),
                                                          ('Kiddush Reeh', 'Kiddush sponsorship for Parshas Reeh'),
                                                          ('Kiddush Shoftim', 'Kiddush sponsorship for Parshas Shoftim'),
                                                          ('Kiddush Ki Seitzei', 'Kiddush sponsorship for Parshas Ki Seitzei'),
                                                          ('Kiddush Ki Savo', 'Kiddush sponsorship for Parshas Ki Savo'),
                                                          ('Kiddush Nitzavim', 'Kiddush sponsorship for Parshas Nitzavim'),
                                                          ('Kiddush Vayeilech', 'Kiddush sponsorship for Parshas Vayeilech'),
                                                          ('Kiddush Haazinu', 'Kiddush sponsorship for Parshas Haazinu'),
                                                          ('Kiddush Vezos HaBeracha', 'Kiddush sponsorship for Parshas Vezos HaBeracha');


INSERT INTO parnes_sponsorships (type, title, description) VALUES
                                                               ('weekly', 'Parnes HaShavua Bereishis', 'Weekly sponsorship for Parshas Bereishis'),
                                                               ('weekly', 'Parnes HaShavua Noach', 'Weekly sponsorship for Parshas Noach'),
                                                               ('weekly', 'Parnes HaShavua Lech Lecha', 'Weekly sponsorship for Parshas Lech Lecha'),
                                                               ('weekly', 'Parnes HaShavua Vayera', 'Weekly sponsorship for Parshas Vayera'),
                                                               ('weekly', 'Parnes HaShavua Chayei Sarah', 'Weekly sponsorship for Parshas Chayei Sarah'),
                                                               ('weekly', 'Parnes HaShavua Toldos', 'Weekly sponsorship for Parshas Toldos'),
                                                               ('weekly', 'Parnes HaShavua Vayetze', 'Weekly sponsorship for Parshas Vayetze'),
                                                               ('weekly', 'Parnes HaShavua Vayishlach', 'Weekly sponsorship for Parshas Vayishlach'),
                                                               ('weekly', 'Parnes HaShavua Vayeshev', 'Weekly sponsorship for Parshas Vayeshev'),
                                                               ('weekly', 'Parnes HaShavua Miketz', 'Weekly sponsorship for Parshas Miketz'),
                                                               ('weekly', 'Parnes HaShavua Vayigash', 'Weekly sponsorship for Parshas Vayigash'),
                                                               ('weekly', 'Parnes HaShavua Vayechi', 'Weekly sponsorship for Parshas Vayechi'),
                                                               ('weekly', 'Parnes HaShavua Shemos', 'Weekly sponsorship for Parshas Shemos'),
                                                               ('weekly', 'Parnes HaShavua Vaera', 'Weekly sponsorship for Parshas Vaera'),
                                                               ('weekly', 'Parnes HaShavua Bo', 'Weekly sponsorship for Parshas Bo'),
                                                               ('weekly', 'Parnes HaShavua Beshalach', 'Weekly sponsorship for Parshas Beshalach'),
                                                               ('weekly', 'Parnes HaShavua Yisro', 'Weekly sponsorship for Parshas Yisro'),
                                                               ('weekly', 'Parnes HaShavua Mishpatim', 'Weekly sponsorship for Parshas Mishpatim'),
                                                               ('weekly', 'Parnes HaShavua Terumah', 'Weekly sponsorship for Parshas Terumah'),
                                                               ('weekly', 'Parnes HaShavua Tetzaveh', 'Weekly sponsorship for Parshas Tetzaveh'),
                                                               ('weekly', 'Parnes HaShavua Ki Sisa', 'Weekly sponsorship for Parshas Ki Sisa'),
                                                               ('weekly', 'Parnes HaShavua Vayakhel', 'Weekly sponsorship for Parshas Vayakhel'),
                                                               ('weekly', 'Parnes HaShavua Pekudei', 'Weekly sponsorship for Parshas Pekudei'),
                                                               ('weekly', 'Parnes HaShavua Vayikra', 'Weekly sponsorship for Parshas Vayikra'),
                                                               ('weekly', 'Parnes HaShavua Tzav', 'Weekly sponsorship for Parshas Tzav'),
                                                               ('weekly', 'Parnes HaShavua Shmini', 'Weekly sponsorship for Parshas Shmini'),
                                                               ('weekly', 'Parnes HaShavua Tazria', 'Weekly sponsorship for Parshas Tazria'),
                                                               ('weekly', 'Parnes HaShavua Metzora', 'Weekly sponsorship for Parshas Metzora'),
                                                               ('weekly', 'Parnes HaShavua Acharei Mos', 'Weekly sponsorship for Parshas Acharei Mos'),
                                                               ('weekly', 'Parnes HaShavua Kedoshim', 'Weekly sponsorship for Parshas Kedoshim'),
                                                               ('weekly', 'Parnes HaShavua Emor', 'Weekly sponsorship for Parshas Emor'),
                                                               ('weekly', 'Parnes HaShavua Behar', 'Weekly sponsorship for Parshas Behar'),
                                                               ('weekly', 'Parnes HaShavua Bechukosai', 'Weekly sponsorship for Parshas Bechukosai'),
                                                               ('weekly', 'Parnes HaShavua Bamidbar', 'Weekly sponsorship for Parshas Bamidbar'),
                                                               ('weekly', 'Parnes HaShavua Naso', 'Weekly sponsorship for Parshas Naso'),
                                                               ('weekly', 'Parnes HaShavua Behaalotecha', 'Weekly sponsorship for Parshas Behaalotecha'),
                                                               ('weekly', 'Parnes HaShavua Shlach', 'Weekly sponsorship for Parshas Shlach'),
                                                               ('weekly', 'Parnes HaShavua Korach', 'Weekly sponsorship for Parshas Korach'),
                                                               ('weekly', 'Parnes HaShavua Chukat', 'Weekly sponsorship for Parshas Chukat'),
                                                               ('weekly', 'Parnes HaShavua Balak', 'Weekly sponsorship for Parshas Balak'),
                                                               ('weekly', 'Parnes HaShavua Pinchas', 'Weekly sponsorship for Parshas Pinchas'),
                                                               ('weekly', 'Parnes HaShavua Matot', 'Weekly sponsorship for Parshas Matot'),
                                                               ('weekly', 'Parnes HaShavua Masei', 'Weekly sponsorship for Parshas Masei'),
                                                               ('weekly', 'Parnes HaShavua Devarim', 'Weekly sponsorship for Parshas Devarim'),
                                                               ('weekly', 'Parnes HaShavua Vaetchanan', 'Weekly sponsorship for Parshas Vaetchanan'),
                                                               ('weekly', 'Parnes HaShavua Eikev', 'Weekly sponsorship for Parshas Eikev'),
                                                               ('weekly', 'Parnes HaShavua Reeh', 'Weekly sponsorship for Parshas Reeh'),
                                                               ('weekly', 'Parnes HaShavua Shoftim', 'Weekly sponsorship for Parshas Shoftim'),
                                                               ('weekly', 'Parnes HaShavua Ki Seitzei', 'Weekly sponsorship for Parshas Ki Seitzei'),
                                                               ('weekly', 'Parnes HaShavua Ki Savo', 'Weekly sponsorship for Parshas Ki Savo'),
                                                               ('weekly', 'Parnes HaShavua Nitzavim', 'Weekly sponsorship for Parshas Nitzavim'),
                                                               ('weekly', 'Parnes HaShavua Vayeilech', 'Weekly sponsorship for Parshas Vayeilech'),
                                                               ('weekly', 'Parnes HaShavua Haazinu', 'Weekly sponsorship for Parshas Haazinu'),
                                                               ('weekly', 'Parnes HaShavua Vezot HaBeracha', 'Weekly sponsorship for Parshas Vezot HaBeracha');


INSERT INTO parnes_sponsorships (type, title, description) VALUES
                                                               ('monthly', 'Parnes HaChodesh Nisan', 'Monthly sponsorship for all events in Nisan'),
                                                               ('monthly', 'Parnes HaChodesh Iyar', 'Monthly sponsorship for all events in Iyar'),
                                                               ('monthly', 'Parnes HaChodesh Sivan', 'Monthly sponsorship for all events in Sivan'),
                                                               ('monthly', 'Parnes HaChodesh Tammuz', 'Monthly sponsorship for all events in Tammuz'),
                                                               ('monthly', 'Parnes HaChodesh Av', 'Monthly sponsorship for all events in Av'),
                                                               ('monthly', 'Parnes HaChodesh Elul', 'Monthly sponsorship for all events in Elul'),
                                                               ('monthly', 'Parnes HaChodesh Tishrei', 'Monthly sponsorship for all events in Tishrei'),
                                                               ('monthly', 'Parnes HaChodesh Cheshvan', 'Monthly sponsorship for all events in Cheshvan'),
                                                               ('monthly', 'Parnes HaChodesh Kislev', 'Monthly sponsorship for all events in Kislev'),
                                                               ('monthly', 'Parnes HaChodesh Tevet', 'Monthly sponsorship for all events in Tevet'),
                                                               ('monthly', 'Parnes HaChodesh Shevat', 'Monthly sponsorship for all events in Shevat'),
                                                               ('monthly', 'Parnes HaChodesh Adar', 'Monthly sponsorship for all events in Adar');
