<?php
/*
Template Name: 未来
Version:1.0
Template Url:https://www.emlog.net/
Description: 一支看见未来，满载对未来的希望的精美 emlog 模板
Author:串串狗xk
Author Url:https://www.ccgxk.com/
*/

defined('EMLOG_ROOT') || exit('access denied!');
if (!function_exists('_g')) { emMsg('请开启【模板设置】插件, <a href="/admin/plugin.php">去开启</a>'); }
?>
<!DOCTYPE html>
<html lang="zh" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title><?= $site_title ?></title>
    <meta name="keywords" content="<?= $site_key ?>" />
    <meta name="description" content="<?= $site_description ?>" />
    <link rel="alternate" title="RSS" href="<?= BLOG_URL ?>rss.php" type="application/rss+xml" />
    <link href="<?= TEMPLATE_URL ?>css/style.css" rel="stylesheet" />
    <link href="<?= TEMPLATE_URL ?>css/mvp.css" rel="stylesheet" />
    <script src="<?= TEMPLATE_URL ?>js/jquery.min.3.5.1.js"></script>
    <script src="<?= TEMPLATE_URL ?>js/main.js"></script>
    <?php doAction('index_head') ?>
</head>

<body>
    <header>
        <a href="<?= BLOG_URL ?>"><?= $blogname ?></a>
        <div title="<?= $bloginfo ?>"><?= $bloginfo ?></div>
        <?php doAction('index_navi_ext') ?>
    </header>