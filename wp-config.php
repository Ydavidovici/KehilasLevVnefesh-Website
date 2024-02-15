<?php
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'eobrmgmy_Database-1');

/** MySQL database username */
define('DB_USER', 'eobrmgmy_209e_cg');

/** MySQL database password */
define('DB_PASSWORD', 'Dalucci35!');

/** MySQL hostname */
define('DB_HOST', '162.241.216.242');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 */
define('AUTH_KEY',         'X(+,WW}zmkK-WpVy9zZ$:c*bSlnLy0ZejilJ88ny@pyCGQff(HeD]y8WAWUc(t2-');
define('SECURE_AUTH_KEY',  '-==0tdR5R;->u82z6B6G6x+#lPkto*@y#[&.j,M)ow+{]|2^lzQ(xQ=z`io$CX@{');
define('LOGGED_IN_KEY',    '_/&)o[oYJ7h-1_KL/f_-a>M>$w!I@~A|S;2IiF+T+A;2q-%2Fvm5I,{?_E|V0Y6`');
define('NONCE_KEY',        ':~ZRLvkeZ8Q5t^-BlB:<:U=`J+b}VO31B&bTS^{9s(c8GS[P!7c n>^$U@RU$-+-');
define('AUTH_SALT',        'Kh`,97r#8->U|4;-(dG~yJEve7~>RG^`d8rH&4Q=uPDBHs<b]*<HhQH.vW.]e(DB');
define('SECURE_AUTH_SALT', '%|C;a[f.=6>1}oa+`;s+!XHMu(t]Go^]?Md-)80e@3z&0H}]nVsK7YxU2ceHPEs!');
define('LOGGED_IN_SALT',   'Q HA*@b7F|>PpH3AHu*;,J<adK+hJV3YmwaZp<<6oHzi|2|dR5{e5a[H:F$kP,qa');
define('NONCE_SALT',       'VK(P?iXhL,*!p^qQ#50F#U8X!/}~Hp-mkL[^9:Z)+HQ(+OayQk=2::Yu~KE>[`@a');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', True);
define('DISALLOW_FILE_EDIT', true);

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');