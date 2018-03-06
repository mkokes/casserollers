<?php

if (file_exists(dirname(__FILE__) . '/wp-config-local.php')) {
	require_once(dirname(__FILE__) . '/wp-config-local.php');
} else {
    define('DB_NAME', 'casserollers_wp');
    define('DB_USER', 'casserollers_sa');
    define('DB_PASSWORD', 'X5z0GX.j7VJYK@5#hb^rjP*zpuLCSzi_');
    define('DB_HOST', 'localhost');
    define('DB_CHARSET', 'utf8');
    define('DB_COLLATE', '');

    define('WP_DEBUG', false);
    define('WP_DEBUG_LOG', false);
    define('WP_DEBUG_DISPLAY', false);

}

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
$table_prefix = 'ca_';



if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );

require_once ABSPATH . 'wp-settings.php';
