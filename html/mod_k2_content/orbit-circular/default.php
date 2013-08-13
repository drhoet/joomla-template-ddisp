<?php
/**
 * @version		$Id: default.php 1812 2013-01-14 18:45:06Z lefteris.kavadas $
 * @package		K2
 * @author		JoomlaWorks http://www.joomlaworks.net
 * @copyright	Copyright (c) 2006 - 2013 JoomlaWorks Ltd. All rights reserved.
 * @license		GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

// no direct access
defined('_JEXEC') or die;
?>

<div id="k2ModuleBox<?php echo $module->id; ?>" class="k2ItemsBlock<?php if($params->get('moduleclass_sfx')) echo ' '.$params->get('moduleclass_sfx'); ?>">

<div class="preloader"></div>
<ul data-orbitcircular data-options="bullets:false;">
    <?php foreach ($items as $key=>$item):	?>
	<li>
		<img src="<?= (property_exists($item, 'image')) ? $item->image : 'http://placehold.it/500x500&text='.$item->title; ?>" alt="<?php echo K2HelperUtilities::cleanHtml($item->title); ?>" />
	</li>
	<?php endforeach; ?>
</ul>

</div>
