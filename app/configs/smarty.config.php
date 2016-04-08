<?php
    //Smarty PHP configuration
    date_default_timezone_set("PRC");
    define('REAL_PATH', dirname(dirname(__FILE__)));

    require_once(REAL_PATH . '/smarty/libs/Smarty.class.php');

    $smarty=new Smarty();

    $smarty->setCacheDir(REAL_PATH . '/cache');
    $smarty->setConfigDir(REAL_PATH . '/configs');
    $smarty->setPluginsDir(REAL_PATH . '/plugins');
    $smarty->setTemplateDir(REAL_PATH . '/tpl');
    $smarty->setCompileDir(REAL_PATH . '/templates_c');


    $smarty->left_delimiter="<%";
    $smarty->right_delimiter="%>";

    //添加Smarty自带的插件库
    $smarty->addPluginsDir(REAL_PATH . '/smarty\plugins');

    //检测Smarty目录结构配置是否有效
    // $smarty->testInstall();
?>
