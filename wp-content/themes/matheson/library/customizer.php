<?php
/**
 * Set up the default theme options
 *
 * @since 1.0.0
 */
function bavotasan_default_theme_options() {
	//delete_option( 'theme_mods_matheson' );
	return array(
		'width' => '992',
		'layout' => 'right',
		'primary' => 'col-md-8',
		'display_author' => 'on',
		'display_date' => 'on',
		'display_comment_count' => 'on',
		'display_categories' => 'on',
		'excerpt_content' => 'excerpt',
		'jumbo_headline_title' => 'A great big headline to catch some attention, because everyone likes attention',
		'jumbo_headline_text' => 'So you understand the roaring wave of fear that swept through the greatest city in the world just as Monday was dawning--the stream of flight rising swiftly to a torrent, lashing in a foaming tumult round the railway stations, banked up into a horrible struggle about the shipping in the Thames, and hurrying by every available channel northward and eastward.  By ten o\'clock the police organisation, and by midday even the railway organisations, were losing coherency, losing shape and efficiency, guttering, softening, running at last in that swift liquefaction of the social body.',
	);
}

function bavotasan_theme_options() {
	$bavotasan_default_theme_options = bavotasan_default_theme_options();

	$return = array();
	foreach( $bavotasan_default_theme_options as $option => $value ) {
		$return[$option] = get_theme_mod( $option, $value );
	}

	return $return;
}

if ( class_exists( 'WP_Customize_Control' ) ) {
	class Bavotasan_Customize_Section_Pro extends WP_Customize_Section {
		public $type = 'premium-upgrade';
		public $pro_url = '';

		public function json() {
			$json = parent::json();
			$json['pro_url']  = esc_url( $this->pro_url );
			return $json;
		}

		protected function render_template() { ?>

			<li id="accordion-section-{{ data.id }}" class="accordion-section control-section control-section-{{ data.type }} cannot-expand premium-upgrade">

				<h3 class="accordion-section-title">
					<a href="{{ data.pro_url }}" target="_blank">{{ data.title }}

					<span class="dashicons dashicons-arrow-right-alt"></span></a>
				</h3>
			</li>
		<?php }
	}

	class Bavotasan_Textarea_Control extends WP_Customize_Control {
	    public $type = 'textarea';

	    public function render_content() {
	        ?>
	        <label>
	        <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
	        <textarea rows="5" style="width:100%;" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
	        </label>
	        <?php
	    }
	}

	class Bavotasan_Post_Layout_Control extends WP_Customize_Control {
	    public function render_content() {
			if ( empty( $this->choices ) )
				return;

			$name = '_customize-radio-' . $this->id;

			?>
			<style>
			#customize-control-layout .customize-control-title {
				margin-bottom: 5px;
			}

			#customize-control-layout label {
				display: block;
				clear: both;
				margin-bottom: 10px;
				position: relative;
			}

			#customize-control-layout label input {
				display: inline-block;
				margin-top: -80px;
			}

			#customize-control-layout div {
				width: 124px;
				height: 84px;
				background: url(<?php echo BAVOTASAN_THEME_URL; ?>/library/images/layout.jpg) no-repeat 0 0;
				display: inline-block;
			}

			#customize-control-layout .right {
				background-position: 0 -84px;
			}
			#customize-control-layout .separate {
				background-position: 0 -168px;
			}
			</style>
			<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
			<?php
			foreach ( $this->choices as $value => $label ) :
				?>
				<label>
					<input type="radio" value="<?php echo esc_attr( $value ); ?>" name="<?php echo esc_attr( $name ); ?>" <?php $this->link(); checked( $this->value(), $value ); ?> />
					<?php echo '<div class="' . esc_attr( $value ) . '"></div>'; ?>
				</label>
				<?php
			endforeach;
			echo '<p class="description">' . __( 'Sidebars only appear on single posts and pages. All other pages are full width.', 'matheson' ) . '</p>';
	    }
	}
}

class Bavotasan_Customizer {
	public function __construct() {
		add_action( 'customize_register', array( $this, 'customize_register' ) );
		add_action( 'customize_controls_enqueue_scripts', array( $this, 'customize_controls_enqueue_scripts' ) );

		$mods = get_option( 'theme_mods_matheson' );
		if ( empty( $mods ) ) {
			add_option( 'theme_mods_matheson', get_option( 'matheson_theme_options' ) );
		}
	}

	public function customize_controls_enqueue_scripts() {
   		wp_enqueue_script( 'bavotasan-upgrade', BAVOTASAN_THEME_URL . '/library/js/admin/upgrade.js', array( 'jquery' ), '', true );

		wp_enqueue_style( 'bavotasan-customizer-styles', BAVOTASAN_THEME_URL . '/library/css/admin/customizer.css' );
	}

	/**
	 * Adds theme options to the Customizer screen
	 *
	 * This function is attached to the 'customize_register' action hook.
	 *
	 * @param	class $wp_customize
	 *
	 * @since 1.0.0
	 */
	public function customize_register( $wp_customize ) {
		$bavotasan_default_theme_options = bavotasan_default_theme_options();

		// Layout section panel
		$wp_customize->add_section( 'bavotasan_layout', array(
			'title' => __( 'Layout', 'matheson' ),
			'priority' => 35,
		) );

		$wp_customize->add_setting( 'width', array(
			'default' => $bavotasan_default_theme_options['width'],
            'sanitize_callback' => 'absint',
		) );

		$wp_customize->add_control( 'width', array(
			'label' => __( 'Site Width', 'matheson' ),
			'section' => 'bavotasan_layout',
			'priority' => 10,
			'type' => 'select',
			'choices' => array(
				'1200' => __( '1200px', 'matheson' ),
				'992' => __( '992px', 'matheson' ),
			),
		) );

		$choices =  array(
			'col-md-2' => '17%',
			'col-md-3' => '25%',
			'col-md-4' => '34%',
			'col-md-5' => '42%',
			'col-md-6' => '50%',
			'col-md-7' => '58%',
			'col-md-8' => '66%',
			'col-md-9' => '75%',
			'col-md-10' => '83%',
			'col-md-12' => '100%',
		);

		$wp_customize->add_setting( 'primary', array(
			'default' => $bavotasan_default_theme_options['primary'],
            'sanitize_callback' => 'esc_attr',
		) );

		$wp_customize->add_control( 'primary', array(
			'label' => __( 'Main Content Width', 'matheson' ),
			'section' => 'bavotasan_layout',
			'priority' => 15,
			'type' => 'select',
			'choices' => $choices,
		) );

		$wp_customize->add_setting( 'layout', array(
			'default' => $bavotasan_default_theme_options['layout'],
            'sanitize_callback' => 'esc_attr',
		) );

		$layout_choices = array(
			'left' => __( 'Left', 'matheson' ),
			'right' => __( 'Right', 'matheson' ),
		);

		$wp_customize->add_control( new Bavotasan_Post_Layout_Control( $wp_customize, 'layout', array(
			'label' => __( 'Sidebar Layout', 'matheson' ),
			'section' => 'bavotasan_layout',
			'size' => false,
			'priority' => 25,
			'choices' => $layout_choices,
		) ) );

		$wp_customize->add_setting( 'excerpt_content', array(
			'default' => $bavotasan_default_theme_options['excerpt_content'],
            'sanitize_callback' => 'esc_attr',
		) );

		$wp_customize->add_control( 'excerpt_content', array(
			'label' => __( 'Post Content Display', 'matheson' ),
			'section' => 'bavotasan_layout',
			'priority' => 30,
			'type' => 'radio',
			'choices' => array(
				'excerpt' => __( 'Teaser Excerpt', 'matheson' ),
				'content' => __( 'Full Content', 'matheson' ),
			),
		) );

		// Jumbo headline section panel
		$wp_customize->add_section( 'bavotasan_jumbo', array(
			'title' => __( 'Jumbo Headline', 'matheson' ),
			'priority' => 36,
			'description' => __( 'This section appears below the slider/header image on the home page. To remove it just delete all the content from the Title textarea.', 'matheson' ),
		) );

		$wp_customize->add_setting( 'jumbo_headline_title', array(
			'default' => $bavotasan_default_theme_options['jumbo_headline_title'],
            'sanitize_callback' => 'esc_textarea',
		) );

		$wp_customize->add_control( new Bavotasan_Textarea_Control( $wp_customize, 'jumbo_headline_title', array(
			'label' => __( 'Title', 'matheson' ),
			'section' => 'bavotasan_jumbo',
			'priority' => 26,
			'type' => 'text',
		) ) );

		$wp_customize->add_setting( 'jumbo_headline_text', array(
			'default' => $bavotasan_default_theme_options['jumbo_headline_text'],
            'sanitize_callback' => 'esc_textarea',
		) );

		$wp_customize->add_control( new Bavotasan_Textarea_Control( $wp_customize, 'jumbo_headline_text', array(
			'label' => __( 'Text', 'matheson' ),
			'section' => 'bavotasan_jumbo',
			'priority' => 27,
			'type' => 'text',
		) ) );

		// Posts panel
		$wp_customize->add_section( 'bavotasan_posts', array(
			'title' => __( 'Posts', 'matheson' ),
			'priority' => 45,
		) );

		$wp_customize->add_setting( 'display_categories', array(
			'default' => $bavotasan_default_theme_options['display_categories'],
            'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
		) );

		$wp_customize->add_control( 'display_categories', array(
			'label' => __( 'Display Categories', 'matheson' ),
			'section' => 'bavotasan_posts',
			'type' => 'checkbox',
		) );

		$wp_customize->add_setting( 'display_author', array(
			'default' => $bavotasan_default_theme_options['display_author'],
            'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
		) );

		$wp_customize->add_control( 'display_author', array(
			'label' => __( 'Display Author', 'matheson' ),
			'section' => 'bavotasan_posts',
			'type' => 'checkbox',
		) );

		$wp_customize->add_setting( 'display_date', array(
			'default' => $bavotasan_default_theme_options['display_date'],
            'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
		) );

		$wp_customize->add_control( 'display_date', array(
			'label' => __( 'Display Date', 'matheson' ),
			'section' => 'bavotasan_posts',
			'type' => 'checkbox',
		) );

		$wp_customize->add_setting( 'display_comment_count', array(
			'default' => $bavotasan_default_theme_options['display_comment_count'],
            'sanitize_callback' => array( $this, 'sanitize_checkbox' ),
		) );

		$wp_customize->add_control( 'display_comment_count', array(
			'label' => __( 'Display Comment Count', 'matheson' ),
			'section' => 'bavotasan_posts',
			'type' => 'checkbox',
		) );

		$wp_customize->register_section_type( 'Bavotasan_Customize_Section_Pro' );
		$wp_customize->add_section(
			new Bavotasan_Customize_Section_Pro ( $wp_customize, 'premium_upgrade', array(
				'title'    => esc_html__( 'Upgrade to Matheson Pro', 'matheson' ),
				'pro_url'  => 'https://themes.bavotasan.com/themes/matheson-pro-wordpress-theme/',
				'priority' => 999,
			) )
		);
	}

	/**
	 * Sanitize checkbox options
	 *
	 * @since 1.0.2
	 */
    public function sanitize_checkbox( $value ) {
        if ( 'on' != $value )
            $value = false;

        return $value;
    }
}
$bavotasan_customizer = new Bavotasan_Customizer;