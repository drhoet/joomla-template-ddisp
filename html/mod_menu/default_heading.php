<?php
/**
 * @version		For ddisp template
 * @package     Joomla.Site
 * @subpackage  mod_menu
 *
 * @copyright   Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Note. It is important to remove spaces between elements.
$class = $item->anchor_css ? 'class="'.$item->anchor_css.'" ' : '';
$title = $item->anchor_title ? 'title="'.$item->anchor_title.'" ' : '';

switch ($item->browserNav) :
	default:
	case 0:
?><a href="#" <?php echo $title; ?>><span <?php echo $class; ?>><?php echo $item->title; ?></span></a><?php
		break;
	case 1:
		// _blank
?><a href="#" target="_blank" <?php echo $title; ?>><span <?php echo $class; ?>><?php echo $item->title; ?></span></a><?php
		break;
	case 2:
	// window.open
?><a href="#" onclick="window.open(this.href,'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');return false;" <?php echo $title; ?>><span <?php echo $class; ?>><?php echo $item->title; ?></span></a>
<?php
		break;
endswitch;