<?php
	include ("./smarty/libs/Smarty.class.php");

	$smarty=new Smarty();

	$smarty->template_dir='../templates';
	$smarty->config_dir='../configs';
	$smarty->cache_dir='../cache';
	$smarty->compile_dir='../templates_c';
	$smarty->caching=false;
	$smarty->left_delimiter="<%";
	$smarty->right_delimiter="%>";
?>