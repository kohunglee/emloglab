<?php

!defined('EMLOG_ROOT') && exit('access denied!');

// 开启插件时执行该函数，初始化配置
function callback_init() {
    $silmimg_storage = Storage::getInstance('plugin_silmimg');
	$silmimg_storage->setValue('silm_displayFBtn_check', 'n');
    $silmimg_storage->setValue('silm_insertHTML_mod', '<a href="{imgUrl}"><img src="{thumbImgUrl}" alt="img"></a>');

}

// 关闭和删除插件时执行该函数，删除所有配置
function callback_rm() {
    $silmimg_storage = Storage::getInstance('plugin_silmimg');
    $ak = $silmimg_storage->deleteAllName('YES'); //删除所有数据
}
