<?php

// For  Local Development use a wp-config-local.php file
if ( file_exists( dirname( __FILE__ ) . '/wp-config-local.php' ) && ! isset( $_ENV['PANTHEON_ENVIRONMENT'] ) ) {
    require_once( dirname( __FILE__ ) . '/wp-config-local.php');
} else {
    // If no Pantheon or wp-config-local.php use these credentials
    define('DB_NAME', 'casserollers_wp');
    define('DB_USER', 'casserollers_sa');
    define('DB_PASSWORD', 'X5z0GX.j7VJYK@5#hb^rjP*zpuLCSzi_');
    define('DB_HOST', 'localhost');
    define('DB_CHARSET', 'utf8');
    define('DB_COLLATE', '');

    // Generate new salt here https://api.wordpress.org/secret-key/1.1/salt/
    define('AUTH_KEY',         '>x>7pBD}90Or|QDm97#!}-fKGB4Xn`}gg++tR#PTbHipz[.;u|wz-5we)vOe5&ID');
    define('SECURE_AUTH_KEY',  '}#gctsQYH7s-/ SQvI_g60C|G7|VL(/cQ|oNf8w-#D+Ue/,fxB o-fWqc*~!j64W');
    define('LOGGED_IN_KEY',    '&jEIde-P!;LRN+E}ek3(i7(CQ{Y9|1M%VTJJB[i>}[EsVANvAu%oCS-1. +biGoN');
    define('NONCE_KEY',        'fz3R92{]KXm*|P|Pne)4as+T~|!~G-Mg0j{%s|ck%798-YcD=NFLHDK:m9,};N|p');
    define('AUTH_SALT',        '+GGluyejO1KqWkPl+pSzo$n:UC!fRxv5.PV-;RQ?g[k[N@-=am`Qc6h|a$`MmX)1');
    define('SECURE_AUTH_SALT', ',9>DPB.mJNR>Rf^R32|H4.oL]6[~Y8-ch]A,*|/d3lk9|XvSJ>V|95&) X@N8W~#');
    define('LOGGED_IN_SALT',   'aVOYtaD*q94q+%wlvO&|sMI+zB/R_E=U+{+Ev7Ii8^Ftmz;NS$7)98fw|+++}woG');
    define('NONCE_SALT',       'AKg[e+|kw+I$IF9!YwLp$vSjdq4)<tOQ%C$Zb7q{zQx?{M;4Y QsYK<X>Nc+:4c!');

    // Disable Wordpress/Plugin and Theme Updates
    define( 'AUTOMATIC_UPDATER_DISABLED', true );
    define( 'WP_AUTO_UPDATE_CORE', false );
    define( 'DISALLOW_FILE_MODS', true );

    // Turn off debug on live environment
    define('WP_DEBUG', false);
    define('WP_DEBUG_DISPLAY', false);
    define('WP_DEBUG_LOG', false);
}

/* Global wp-config stuff here */
$table_prefix = 'ca_';

define('WPLANG', '');

if ( ! defined( 'WP_DEBUG' ) ) {
    define('WP_DEBUG', false);
}

/* That's all, stop editing! Happy Pressing. */

if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
