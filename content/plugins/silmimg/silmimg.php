<?php
/*
Plugin Name: 先压缩后上传图片工具 1.5
Version: 1.5
Description: 很实用的小工具，在文章编辑页上传图片时，先压缩图片后上传，节约服务器（或图床）空间。支持设置压缩参数，支持多图处理。
Author: 串串狗xk
Author URL: https://www.emlog.net/author/index/578
*/

!defined('EMLOG_ROOT') && exit('access deined!');

function silmimg_display() {
?>
    <!-- <a id="silmimgBtn" class="btn btn-Link silmimg-btn" data-toggle="modal" data-target="#silmimgModal">[图片压缩上传工具]</a> -->
    <a href="#silmimgModal" class="ml-3" data-toggle="modal" data-target="#silmimgModal">图片压缩上传工具</a>
    


<!-- 图片压缩插件 脚本结束 -->
<?php
}

addAction('adm_writelog_bar', 'silmimg_display');

addAction('adm_writelog_head', function(){  // 兼容 page 编辑页面，也添加上这个工具
  echo '
    <a href="#silmimgModal" class="ml-3" data-toggle="modal" data-target="#silmimgModal">图片压缩上传工具</a>
    <div id="silmIBtn" class="silmimg-movebtn mh" title="我是可以拖动的">压图<br/>工具</div>
  ';
});

addAction('adm_head', function(){  // CSS 样式表
  ?>
<!-- 图片压缩插件 CSS 样式表 -->
<style>
      .silmimg-movebtn {
        font-size: 14px;
        font-weight: bolder;
        color: #b7b7b7;
        background-color: #f7ffde;
        position: fixed;
        width: 50px;
        height: 50px;
        border-radius: 40%;
        border: solid 4px #b7b7b7;
        z-index: 99999;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        left: 1000px;
        top: 200px;
      }
      #multipleImgInfo {
        position: absolute;
        width: 50%;
        height: 300px;
        overflow-x: hidden;
      }
      #singleImgSize {
        cursor: pointer;
        display: contents;
      }
      #singleImgDisplay {
        max-width: 50%;
        position: absolute;
        overflow-x: hidden;
        cursor: pointer;
      }
      #silmImgTool,singleImgTempDisplay {
        display: inline;
        float: right;
        padding-right: 1.5em;
        margin-right: 1em;
        min-height: 300px;
      }
      #silmExportHtml,.silmimg-sizeDisplay { user-select: none; }
      #silmExportHtmlCode { cursor: pointer; }
      .silmimg-sizeDisplay {color:red; cursor: pointer;}
      .silmbtn {border: 0;}
      .silmimg-movebtn:hover { color: #4aa4ea; border-color: #4aa4ea;}
      .silmimg-e2 { background: aliceblue; border: 0px; }
      .silmimgfile_label { padding: 5px 10px; border: 1px dashed black; font-size: 0.8rem; }
      @media all and (max-width: 991px) { .mh { display: none } }
    </style>  
  
  
  <?php });

addAction('adm_footer', function(){  // js 脚本和模态框
  $silmimg_storage = Storage::getInstance('plugin_silmimg');
  $silm_displayFBtn_check = $silmimg_storage->getValue('silm_displayFBtn_check');
  $silm_insertHTML_mod = stripslashes($silmimg_storage->getValue('silm_insertHTML_mod'));
?>
    <!-- 模态框（Modal） -->
    <div class="modal fade" id="silmimgModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" style="padding: 2em 2em 0 2em;">
          <div class="silmimg-c">
            <label class="silmimgfile_label" id="silmimgDropzone" for="silmimgFile">选择或拖拽本地图片（支持多选）</label>
            <input id="silmimgFile" name="silmimgFile" type="file" style="display: none;" accept="image/*" multiple /><br>或<br>
            <input class="silmimg-e2" placeholder="在此处粘贴单个图片"  style="width: 100%; padding: 1em;" rows="2" id="output" />
            <br><br><br>
            <input type="button" id='silmimgUploadInsert' class="silmbtn btn-success btn-sm" value="上传并插入(仅支持默认编辑器)" />
            <input type="button" id='silmimgOnlyUpload' class="silmbtn btn-success btn-sm" value="仅上传" />
            <input type="button" id='silmimgSaveImg' class="silmbtn btn-success btn-sm" value="保存到本地（jpg）" />
            <span id="silmimgMsg" style="color: blueviolet;"></span><br><br>
            <details>
              <summary id='silmExportHtml'>上传成功后获取的图片链接（可复制粘贴到编辑器）</summary>
              <div id='silmExportHtmlCode'>您还没有上传图片...</div>
            </details>
            <br>
          </div>
          压缩结果详情 : <span id="singleImgSize"></span>
          <div>
            <div id="multipleImgInfo"></div>
            <div id="singleImgDisplay"></div>
            <div id="silmImgTool">
                最大宽度 (px) <input type="number" id="silmimgInMaxWidth" value="2000" /><br><br>
                <label id='silmRangName'>质量 (1 - 10)</label> <input type="range" name="points" min="10" max="100" id="silmRang" value="20" /><span id="silmimgInQMsg">2</span><br><br>
                转换结果类型 <input type="radio" id="silmimgCheckJpg" name="convertType" value="jpg" checked> <label for="jpg">jpg(体积小)</label>
                        <input type="radio" id="silmimgCheckPng" name="convertType" value="png"> <label for="png">png(更清晰)</label><br><br>
                是否黑白化 <input type="checkbox" id="silmimgInBlack" /><br><br>
                <input type="button" id='silmAllReset' class="silmbtn btn-success btn-sm" value="全部重置" />
            </div>
            <div id="singleImgTempDisplay"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭
            </button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal -->
    </div>
    <script>
      // 载入配置
      var silmimgConfig = {
        isDisplayFBtn : '<?= $silm_displayFBtn_check ?>',
        insertHtmlMod : `<?= $silm_insertHTML_mod  ?>`
      };
    </script>
    <script src="<?php echo BLOG_URL; ?>content/plugins/silmimg/js/upng.js"></script>
    <script src="<?php echo BLOG_URL; ?>content/plugins/silmimg/js/pako.min.js"></script>
    <script src="<?php echo BLOG_URL; ?>content/plugins/silmimg/js/jszip.min.js"></script>
    <script src="<?php echo BLOG_URL; ?>content/plugins/silmimg/js/FileSaver.min.js"></script>
    <script src="<?php echo BLOG_URL; ?>content/plugins/silmimg/js/main.jsv=1.5"></script>
<?php });


