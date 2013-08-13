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

    <?php foreach ($items as $key=>$item):	?>
    <div class="panel white">

		<?php if($params->get('itemTitle')): ?>
		<h2>
			<?php if($item->link): ?>
			<a href="<?php echo $item->link; ?>">
			<?php endif; ?>
				<?php echo $item->title; ?>
			<?php if($item->link): ?>
			</a>
			<?php endif; ?>
		</h2>
		<?php endif; ?>

		<?php if($params->get('itemImage') && isset($item->image)): ?>
		<img src="<?php echo $item->image; ?>" alt="<?php echo K2HelperUtilities::cleanHtml($item->title); ?>"/>
		<?php endif; ?>

      	<?php if($params->get('itemIntroText')): ?>
			<?php echo $item->introtext; ?>
      	<?php endif; ?>

		<?php if($params->get('itemReadMore') && $item->fulltext): ?>
			<a class="moduleItemReadMore" href="<?php echo $item->link; ?>">
				<?php echo JText::_('K2_READ_MORE'); ?>
			</a>
		<?php endif; ?>

    </div>
    <?php endforeach; ?>
</div>
