<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', 'root' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'ZLySxRbUQJRUy8qpY7A3asmHNyFAxly6OuxXawTiQJZQeaneYM+6o61y1dRr4RPU9/ukedW3jxM5O9RUXO95WQ==');
define('SECURE_AUTH_KEY',  '3va3bx31d1QQmj1R30VOhHsZ6AutpLwihs/axJ4XPAIPe27FYjYDYB4RxE+l+4oRL7r+e7ngcuU1jSJDM9IAUw==');
define('LOGGED_IN_KEY',    '1OR4HfbpaYcfE51dwno/S5BbEweDW79g54U0y2kFH7RuC5Yh6D8SX5D+ER2AQ8evrkHYcAggW9Py3POgl9d7Qw==');
define('NONCE_KEY',        'twKrwnEeC09pM7iPyNk18Bps1WKI2D0pUlBq6//478KrC0kIcrR1K6+q0K0eI9+ZpIc3CfcNAFpFwXtFBReExg==');
define('AUTH_SALT',        '9fort82VfubhX8XnCwCPGA3dSCZgNALY6rU1ASlIab7i/E23XHjgEjhqMtcY91rLY+U7W3asX9hOZQ3/aLb0pg==');
define('SECURE_AUTH_SALT', 'cEIUDfWURNErd9QI40sghCZbNdQ3KqAlm+gF1EUhqIH+iM4DKMVcuMtO+BvZFO0JkHmwPiL1jxxa15EcUjcEMQ==');
define('LOGGED_IN_SALT',   'iCmiZRhhAgqbTyeoe1+SiNoSxcV0qnIhV76b2+i+0OTtQVSDAeU4Jpz0Ea0WBA4fgchK5/1UkimyPfBkUha2Gw==');
define('NONCE_SALT',       'A0QpStQ/FhJDETAqbOXuJSmSsgav7pcnyWLuITjsns0BgQU8KPQ6MeVZaSF6B0+kNbrJt/3hzqef1/fPknhGTA==');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';





/* Inserted by Local by Flywheel. See: http://codex.wordpress.org/Administration_Over_SSL#Using_a_Reverse_Proxy */
if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ) {
	$_SERVER['HTTPS'] = 'on';
}
/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
