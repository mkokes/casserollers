<?php
/**
 * The first/left sidebar widgetized area.
 *
 * If no active widgets in sidebar, default login widget will appear.
 *
 * @since 1.0.0
 */
if ( ! is_bavotasan_full_width() ) {
	?>
	<div id="secondary" <?php bavotasan_sidebar_class(); ?> role="complementary">
		
	</div><!-- #secondary.widget-area -->
	<?php
}