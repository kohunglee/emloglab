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
    <article id="emlogEchoLog"><?= $log_content ?></article>

    <?php doAction('log_related', $logData) ?>

</article>
<?php include View::getView('footer') ?>