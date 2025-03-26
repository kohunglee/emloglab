<?php

/**
 * 首页模板
 */
defined('EMLOG_ROOT') || exit('access denied!');
?>
<main>
    <?php doAction('index_loglist_top');
    if (!empty($logs)):
        foreach ($logs as $value):
    ?>
    <div>
        <a href="<?= $value['log_url'] ?>"><?= $value['log_title'] ?></a>
        <time><?= date('Y-n-j H:i', $value['date']) ?></time>
        <a href="<?= $value['log_url'] ?>"><span></span> <?= $value['views'] ?></a>
        <a href="<?= $value['log_url'] ?>#comment"><span></span> <?= $value['comnum'] ?></a>
    </div>
    <?php
        endforeach;
    else:
        ?>
        <p>抱歉，暂时还没有内容。</p>
    <?php endif ?>
    <div>
        <?= $page_url ?>
    </div>
</main>

<?php include View::getView('footer') ?>