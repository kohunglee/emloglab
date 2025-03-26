<?php
!defined('EMLOG_ROOT') && exit('error');

$silmimg_storage = Storage::getInstance('plugin_silmimg');

function plugin_setting_view(){
    global $silmimg_storage;
    $act = Input::getStrVar('act', '');
    if($act == "save") {
        $getConfig = [  // 获取 post 得来的数据
            'silm_displayFBtn_check'	=> Input::postStrVar('silm_displayFBtn_check', ''),
            'silm_insertHTML_mod'	=> Input::postStrVar('silm_insertHTML_mod','<a href="{imgUrl}"><img src="{thumbImgUrl}" alt="img"></a>')
        ];
        $silmimg_storage->setValue('silm_displayFBtn_check', $getConfig['silm_displayFBtn_check']);
        $silmimg_storage->setValue('silm_insertHTML_mod', $getConfig['silm_insertHTML_mod']);
    }
    function silm_displayFBtn_check($key){
        global $silmimg_storage;
        if ($silmimg_storage->getValue('silm_displayFBtn_check') ==  $key){ return "checked"; }
    }
    function silm_insertHTML_mod(){
        global $silmimg_storage;
        return stripslashes($silmimg_storage->getValue('silm_insertHTML_mod'));
    }
?>

<?php if (isset($_GET['act'])): ?>
    <script>layer.alert('保存成功', {icon: 1,shadeClose: true,title: 'info',});</script>
<?php endif; ?>

<style>
    .silm-panel {
        max-width: 500px;
        background-color: white;
        padding: 1em;
        margin-block: 1em;
        border-radius: 10px;
        border: 1px solid #e7e7e7;
    }
    .silm-set-list { padding: 0.5em; }
    .silm-textera {
        width: 100%;
        height: 100px;
        margin-left: 1em;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        background-color: #f3f3f3;
        border: 1px solid #d1d3e2;
        border-radius: 0.35rem;
        margin-block: 1em;
    }
    .silm-isDisplaybtn { margin: 1.5em; }
    .silm-pre { margin-left: 1em; }
    .silm-btn-right { text-align: right; }
    .silm-sometip { margin-block: 1em; }
    .back-a { text-decoration: underline; }
</style>

<h2>压图工具 - 配置</h2>

<div class='silm-sometip'>
    <a class="back-a" href='plugin.php'>返回上一页</a>
    <span>（在文章编辑页的工具栏部，可看到 [图片压缩上传工具] 。）</span>
</div>

<div class='silm-panel shadow'>
    <form action="plugin.php?plugin=silmimg&act=save" id="silmConfig" method="post" name="input" class='silm-set-form'>
        <div class='silm-set-list'>
            <div class='silm-label' for="input1">1. 是否显示可拖拽的悬浮「压图工具」按钮 ？</div>
            <div class='silm-isDisplaybtn'>
                <input class='' type="radio" name="silm_displayFBtn_check" value="y" <?= silm_displayFBtn_check("y") ?> />是&nbsp;&nbsp;
                <input class='' type="radio" name="silm_displayFBtn_check" value="n" <?= silm_displayFBtn_check("n") ?> />否
            </div>
        </div>
        <div class='silm-set-list'>
            <div class='silm-label'>2. 上传后生成的 HTML 代码的模板 ：</div>
            <textarea class='silm-textera' name="silm_insertHTML_mod"><?= silm_insertHTML_mod() ?></textarea>
            <pre class='silm-pre'>
示例：
&lt;a href="{imgUrl}"&gt;
    &lt;img src="{thumbImgUrl}" alt="img"&gt;
&lt;/a&gt;

*：{imgUrl} 指原图地址，{thumbImgUrl} 指略缩图地址。
            </pre>
        </div>
        <div class='silm-btn-right'><input id="savesilmConfig" class='btn btn-sm btn-success' type="submit" value="保存" /></div>
    </form>
</div>

<?php } ?>