<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <main>
 * and the left sidebar conditional
 *
 * @since 1.0.0
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

	<div id="page">

		<header id="header">
			<div class="container header-meta">
				<div id="site-meta">
					<?php $tag = ( is_front_page() && is_home() ) ? 'h1' : 'div'; ?>
					<<?php echo $tag; ?> class="site-title" >
						<a href="<?php echo esc_url( home_url() ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
					</<?php echo $tag; ?>>

					<div class="site-description">
						<?php bloginfo( 'description' ); ?>
					</div>
				</div>

				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		          <i class="fa fa-bars"></i>
		        </button>

				<nav id="site-navigation" class="navbar" role="navigation">
					<h3 class="sr-only"><?php _e( 'Main menu', 'matheson' ); ?></h3>
					<a class="sr-only" href="#primary" title="<?php esc_attr_e( 'Skip to content', 'matheson' ); ?>"><?php _e( 'Skip to content', 'matheson' ); ?></a>

					<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container_class' => 'collapse navbar-collapse', 'menu_class' => 'nav nav-justified', 'fallback_cb' => 'bavotasan_default_menu' ) ); ?>
				</nav><!-- #site-navigation -->
			</div>
		</header>

		<?php
		// Header image section
		bavotasan_header_images();
		?>

		<main>