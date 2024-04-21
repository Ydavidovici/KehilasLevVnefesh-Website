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
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Nisan', 'Sponsorship for the month of Nisan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Iyar', 'Sponsorship for the month of Iyar'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Sivan', 'Sponsorship for the month of Sivan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Tamuz', 'Sponsorship for the month of Tamuz'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Av', 'Sponsorship for the month of Av'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Elul', 'Sponsorship for the month of Elul'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Tishri', 'Sponsorship for the month of Tishri'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Cheshvan', 'Sponsorship for the month of Cheshvan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Kislev', 'Sponsorship for the month of Kislev'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Tevet', 'Sponsorship for the month of Tevet'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Shevat', 'Sponsorship for the month of Shevat'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaChodesh'), 'Adar', 'Sponsorship for the month of Adar');


INSERT INTO sponsorship_details (type_id, detail_name, description)
VALUES
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Bereshis', 'Sponsorship for Parashat Bereshis'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Noach', 'Sponsorship for Parashat Noach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Lech Lecha', 'Sponsorship for Parashat Lech Lecha'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayera', 'Sponsorship for Parashat Vayera'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Chayei Sarah', 'Sponsorship for Parashat Chayei Sarah'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Toldos', 'Sponsorship for Parashat Toldos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayetze', 'Sponsorship for Parashat Vayetze'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayishlach', 'Sponsorship for Parashat Vayishlach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayeshev', 'Sponsorship for Parashat Vayeshev'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Miketz', 'Sponsorship for Parashat Miketz'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayigash', 'Sponsorship for Parashat Vayigash'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayechi', 'Sponsorship for Parashat Vayechi'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Shemos', 'Sponsorship for Parashat Shemos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vaera', 'Sponsorship for Parashat Vaera'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Bo', 'Sponsorship for Parashat Bo'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Beshalach', 'Sponsorship for Parashat Beshalach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Yisro', 'Sponsorship for Parashat Yisro'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Mishpatim', 'Sponsorship for Parashat Mishpatim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Terumah', 'Sponsorship for Parashat Terumah'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Tetzaveh', 'Sponsorship for Parashat Tetzaveh'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Ki Sisa', 'Sponsorship for Parashat Ki Sisa'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayakhel', 'Sponsorship for Parashat Vayakhel'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Pekudei', 'Sponsorship for Parashat Pekudei'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayikra', 'Sponsorship for Parashat Vayikra'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Tzav', 'Sponsorship for Parashat Tzav'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Shmini', 'Sponsorship for Parashat Shmini'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Tazria', 'Sponsorship for Parashat Tazria'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Metzora', 'Sponsorship for Parashat Metzora'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Acharei Mos', 'Sponsorship for Parashat Acharei Mos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Kedoshim', 'Sponsorship for Parashat Kedoshim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Emor', 'Sponsorship for Parashat Emor'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Behar', 'Sponsorship for Parashat Behar'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Bechukosai', 'Sponsorship for Parashat Bechukosai'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Bamidbar', 'Sponsorship for Parashat Bamidbar'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Naso', 'Sponsorship for Parashat Naso'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Behaalosecha', 'Sponsorship for Parashat Behaalosecha'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Shlach', 'Sponsorship for Parashat Shlach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Korach', 'Sponsorship for Parashat Korach'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Chukas', 'Sponsorship for Parashat Chukas'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Balak', 'Sponsorship for Parashat Balak'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Pinchas', 'Sponsorship for Parashat Pinchas'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Matos', 'Sponsorship for Parashat Matos'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Masei', 'Sponsorship for Parashat Masei'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Devarim', 'Sponsorship for Parashat Devarim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vaeschanan', 'Sponsorship for Parashat Vaeschanan'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Eikev', 'Sponsorship for Parashat Eikev'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Reeh', 'Sponsorship for Parashat Reeh'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Shoftim', 'Sponsorship for Parashat Shoftim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Ki Seitzei', 'Sponsorship for Parashat Ki Seitzei'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Ki Savo', 'Sponsorship for Parashat Ki Savo'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Nitzavim', 'Sponsorship for Parashat Nitzavim'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vayeilech', 'Sponsorship for Parashat Vayeilech'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Haazinu', 'Sponsorship for Parashat Haazinu'),
    ((SELECT type_id FROM sponsorship_types WHERE type_name = 'Parnes HaShavua'), 'Vezos HaBeracha', 'Sponsorship for Parashat Vezos HaBeracha');


