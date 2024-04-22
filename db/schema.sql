USE kehilas_lev_vnefesh;

CREATE TABLE IF NOT EXISTS minyan_times (
id INT AUTO_INCREMENT PRIMARY KEY,
day VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL,
time VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS file_uploads (
id INT AUTO_INCREMENT PRIMARY KEY,
original_name VARCHAR(255) NOT NULL,
file_data MEDIUMBLOB NOT NULL,

upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS announcements (
id INT AUTO_INCREMENT PRIMARY KEY,
header VARCHAR(255) NOT NULL,
text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sponsorship_types (
type_id INT AUTO_INCREMENT PRIMARY KEY,
type_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sponsorship_details (
detail_id INT AUTO_INCREMENT PRIMARY KEY,
type_id INT NOT NULL,
detail_name VARCHAR(255) NOT NULL,
description TEXT DEFAULT NULL,
FOREIGN KEY (type_id) REFERENCES sponsorship_types(type_id)
);

CREATE TABLE IF NOT EXISTS sponsors (
sponsor_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
contact_info TEXT
);

CREATE TABLE IF NOT EXISTS sponsorships (
stripe_payment_id VARCHAR(255),
sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
sponsor_id INT NOT NULL,
detail_id INT NOT NULL,
date DATE NOT NULL,
amount DECIMAL(10,2),
FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id),
FOREIGN KEY (detail_id) REFERENCES sponsorship_details(detail_id)
);


INSERT INTO sponsorship_types (type_name)
VALUES ('Hot Kiddush'), ('Cold Kiddush'), ('Parnes HaChodesh'), ('Parnes HaShavua');

INSERT INTO sponsorship_details (type_id, detail_name, description)
VALUES
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh' LIMIT 1), 'Nisan', 'Sponsorship for the month of Nisan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh' LIMIT 1), 'Iyar', 'Sponsorship for the month of Iyar'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh' LIMIT 1), 'Sivan', 'Sponsorship for the month of Sivan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Tamuz', 'Sponsorship for the month of Tamuz'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh' LIMIT 1), 'Av', 'Sponsorship for the month of Av'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Elul', 'Sponsorship for the month of Elul'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Tishri', 'Sponsorship for the month of Tishri'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Cheshvan', 'Sponsorship for the month of Cheshvan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Kislev', 'Sponsorship for the month of Kislev'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Tevet', 'Sponsorship for the month of Tevet'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Shevat', 'Sponsorship for the month of Shevat'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'LIMIT 1), 'Adar', 'Sponsorship for the month of Adar');


INSERT INTO sponsorship_details (type_id, detail_name, description)
VALUES
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Bereshis', 'Sponsorship for Parashat Bereshis'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Noach', 'Sponsorship for Parashat Noach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Lech Lecha', 'Sponsorship for Parashat Lech Lecha'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayera', 'Sponsorship for Parashat Vayera'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Chayei Sarah', 'Sponsorship for Parashat Chayei Sarah'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Toldos', 'Sponsorship for Parashat Toldos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayetze', 'Sponsorship for Parashat Vayetze'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayishlach', 'Sponsorship for Parashat Vayishlach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayeshev', 'Sponsorship for Parashat Vayeshev'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Miketz', 'Sponsorship for Parashat Miketz'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayigash', 'Sponsorship for Parashat Vayigash'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayechi', 'Sponsorship for Parashat Vayechi'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Shemos', 'Sponsorship for Parashat Shemos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vaera', 'Sponsorship for Parashat Vaera'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Bo', 'Sponsorship for Parashat Bo'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Beshalach', 'Sponsorship for Parashat Beshalach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Yisro', 'Sponsorship for Parashat Yisro'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Mishpatim', 'Sponsorship for Parashat Mishpatim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Terumah', 'Sponsorship for Parashat Terumah'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Tetzaveh', 'Sponsorship for Parashat Tetzaveh'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Ki Sisa', 'Sponsorship for Parashat Ki Sisa'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayakhel', 'Sponsorship for Parashat Vayakhel'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Pekudei', 'Sponsorship for Parashat Pekudei'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayikra', 'Sponsorship for Parashat Vayikra'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Tzav', 'Sponsorship for Parashat Tzav'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Shmini', 'Sponsorship for Parashat Shmini'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Tazria', 'Sponsorship for Parashat Tazria'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Metzora', 'Sponsorship for Parashat Metzora'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Acharei Mos', 'Sponsorship for Parashat Acharei Mos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Kedoshim', 'Sponsorship for Parashat Kedoshim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Emor', 'Sponsorship for Parashat Emor'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Behar', 'Sponsorship for Parashat Behar'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Bechukosai', 'Sponsorship for Parashat Bechukosai'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Bamidbar', 'Sponsorship for Parashat Bamidbar'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Naso', 'Sponsorship for Parashat Naso'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Behaalosecha', 'Sponsorship for Parashat Behaalosecha'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Shlach', 'Sponsorship for Parashat Shlach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Korach', 'Sponsorship for Parashat Korach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Chukas', 'Sponsorship for Parashat Chukas'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Balak', 'Sponsorship for Parashat Balak'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Pinchas', 'Sponsorship for Parashat Pinchas'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Matos', 'Sponsorship for Parashat Matos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Masei', 'Sponsorship for Parashat Masei'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Devarim', 'Sponsorship for Parashat Devarim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vaeschanan', 'Sponsorship for Parashat Vaeschanan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Eikev', 'Sponsorship for Parashat Eikev'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Reeh', 'Sponsorship for Parashat Reeh'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Shoftim', 'Sponsorship for Parashat Shoftim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Ki Seitzei', 'Sponsorship for Parashat Ki Seitzei'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Ki Savo', 'Sponsorship for Parashat Ki Savo'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Nitzavim', 'Sponsorship for Parashat Nitzavim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vayeilech', 'Sponsorship for Parashat Vayeilech'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Haazinu', 'Sponsorship for Parashat Haazinu'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua' LIMIT 1), 'Vezos HaBeracha', 'Sponsorship for Parashat Vezos HaBeracha');
