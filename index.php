<?php
/**
 * @package     ddisp
 *
 * @copyright   Copyright (C) 2013 Dries Hoet
 * @license     Creative Commons CC BY-SA 3.0, http://creativecommons.org/licenses/by-sa/3.0/
 */

defined('_JEXEC') or die;

// Getting params from template
// $params = JFactory::getApplication()->getTemplate(true)->params;

$app = JFactory::getApplication();
$doc = JFactory::getDocument();
$this->language = $doc->language;

// Add JavaScripts
$doc->addScript('templates/'.$this->template.'/javascripts/vendor/custom.modernizr.js');

// Add Stylesheets
$doc->addStyleSheet('templates/'.$this->template.'/stylesheets/app.css');
$doc->addStyleSheet('templates/'.$this->template.'/stylesheets/typography.css');

?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="<?php echo $this->language; ?>"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="<?php echo $this->language; ?>"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="<?php echo $this->language; ?>"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="<?php echo $this->language; ?>"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<jdoc:include type="head" />
		<!--[if IE 8]>
			<link rel="stylesheet" href="templates/<?=$this->template?>/stylesheets/ie8.css">
		<![endif]-->

		<!--[if IE 7]>
			<link rel="stylesheet" href="templates/<?=$this->template?>/stylesheets/ie7.css">
		<![endif]-->
	</head>
	<body>
		<div id="header" class="row">
			<div id="logo" class="large-2 columns">
				<img src="<?php echo JURI::root() . $this->params->get('logoFile'); ?>" alt="Site logo"/>
			</div>
			<div class="large-10 columns">
				<div id="infobox">
					<jdoc:include type="modules" name="top" style="none" />
				</div>
				<div id="menu">
					<jdoc:include type="modules" name="menu" />
				</div>
			</div>
		</div>

		<!-- End Header and Nav -->

		<?php if ($this->countModules('content-top')) : ?>
		<!-- Content-Top -->

		<div id="banner" class="row">
			<div class="large-12 columns">
				<jdoc:include type="modules" name="content-top" />
				<hr />
			</div>
		</div>
		<?php endif; ?>

		<!-- Three-up Content Blocks -->

		<div class="row">
			<?php if ($this->countModules('left')) : ?>
			<div class="large-4 columns">
				<jdoc:include type="modules" name="left" />
			</div>
			<?php endif; ?>

			<div class="large-<?php echo 12-4*($this->countModules('left')>0)-4*($this->countModules('right')>0) ?> columns">
				<jdoc:include type="message" />
				<jdoc:include type="component" />
			</div>

			<?php if ($this->countModules('right')) : ?>
			<div class="large-4 columns">
				<jdoc:include type="modules" name="right" />
			</div>
			<?php endif; ?>

		</div>

		<?php if ($this->countModules('content-bottom')) : ?>
		<!-- Content-Bottom -->

		<div id="banner" class="row">
			<div class="large-12 columns">
				<jdoc:include type="modules" name="content-bottom" />
			</div>
		</div>
		<?php endif; ?>

		<?php if ($this->countModules('footer')) : ?>
		<!-- Footer -->

		<footer class="row">
			<div class="large-12 columns">
				<hr />
				<jdoc:include type="modules" name="footer" />
			</div> 
		</footer>
		<?php endif; ?>

		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.js"></script>
		<!--script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.alerts.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.clearing.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.cookie.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.dropdown.js"></script-->
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.forms.js"></script>
		<!--script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.interchange.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.joyride.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.magellan.js"></script-->
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.orbit.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation.orbit.circular.js"></script>
		<!--script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.placeholder.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.reveal.js"></script-->
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.section.js"></script>
		<!--script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.tooltips.js"></script>
		<script src="templates/<?= $this->template ?>/javascripts/foundation/foundation.topbar.js"></script-->

		<script>
			jQuery(document).foundation();
		</script>
	</body>
</html>
