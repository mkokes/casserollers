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
define('AUTH_KEY',         '$kl[v?l;|%uI|gHw5EXi&sBXmM^Uv/]+U[e&,bZ/lkBv.jq+uM0&glDM+:O4A+,a');
define('SECURE_AUTH_KEY',  '`$-GlOgok)reJV)(m(v,t%;,aWXYoa? +?{|_mX.2%;CbZ)>|%`}0SHlPDXXQ5b#');
define('LOGGED_IN_KEY',    'B-8E|$?SijqeM3@&+Z)eu+n;@BGBNL^}:WG9;Fd%hJ{!8{8*edT|p#>&,~i`.s!$');
define('NONCE_KEY',        's6tv-qP/[|fYnd*|+HRNxUl!#sBCFZ!R0:l<taC $s<nq9;+go!jjXC6<##D]~A3');
define('AUTH_SALT',        'NsNrnuefYb,26+.2U+bX|A*Zt8t$@d$_%`J?[)|~MctdOv<#P|aVwkz+COtH,c6C');
define('SECURE_AUTH_SALT', '$RFEPB,I-i6#A7U0Bf# .>3}ko:9WSf^g=%<SWl!u|T<;T~s`{.9F?X)-!0jB{}0');
define('LOGGED_IN_SALT',   'm!pguAd:qL*rzEb[*Q:d;OCWmc[:)/.Q9Z[|uao!+i+zeVE;o/U395dO,+.Wc.]J');
define('NONCE_SALT',       'TX{Lf,>/j#^SZ;]=>+KE5~$D(RvN18_ks5!-5x0T1cnu+0D]..mCvcbU 5_e|Z@>');

$table_prefix = 'ca_';

if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );

require_once ABSPATH . 'wp-settings.php';
