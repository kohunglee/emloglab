<?php

/**
 * 阅读文章页面
 */
defined('EMLOG_ROOT') || exit('access denied!');
?>
<article>
    <h1><?= $log_title ?></h1>
    <p>
        <time><?= date('Y-n-j H:i', $date) ?></time>
        <span>阅读：<?= $views ?></span>
    </p>
    <hr/>
    <div id="emlogEchoLog"><?= $log_content ?></div>

    <?php doAction('log_related', $logData) ?>

    <div style="clear:both;"></div>
</article>
<?php include View::getView('footer') ?>