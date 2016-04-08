<?php


require_once(dirname(__FILE__) . '/../configs/smarty.config.php');

$smarty->assign('hello', 'hello world! FEET');

$smarty->display('index.tpl');
?>
