<?php
/**
 * @package     ddisp
 *
 * @copyright   Copyright (C) 2013 Dries Hoet
 * @license     Creative Commons CC BY-SA 3.0, http://creativecommons.org/licenses/by-sa/3.0/
 */

defined('_JEXEC') or die;

$app   = JFactory::getApplication();
$doc   = JFactory::getDocument();
$this->language = $doc->language;
$this->direction = $doc->direction;

// Add JavaScripts
$doc->addScript('templates/'.$this->template.'/javascripts/vendor/custom.modernizr.js');

// Add Stylesheets
$doc->addStyleSheet('templates/'.$this->template.'/stylesheets/app.css');

?>
<!DOCTYPE html>
<!--[if IE 8]> 				 <html class="no-js lt-ie9" lang="<?php echo $this->language; ?>" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="<?php echo $this->language; ?>" > <!--<![endif]-->
	<head>
		<jdoc:include type="head" />
	</head>
	<body class="contentpane modal">
		<jdoc:include type="message" />
		<jdoc:include type="component" />
	</body>
</html>
