// 压图插件 主 JavaScript 运行库

(function(){
  let drawWidth = 2000; // 统一宽度值
  let imgQuality = 0.2; // 质量（或 png 颜色）
  let is_balck = false; // 黑白
  let is_locked = false;// 锁，防止程序在处理过程中被其他命令打断
  let domImg = []; let s_imgSize; let r_imgSize;
  let base64dataArr = []; let out_base64 = []; let out_Blobdata = [];
  let temp_out_base64 = [];
  let convertType = 'jpg';
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  
  $("#silmimgMsg").html('请在上方导入您要压缩的图片');

  // 程序入口
  const drawImg = function(){
    if(base64dataArr.length < 1) return;
    is_locked = true;
    multipleImgInfo.innerHTML = '';
    singleImgSize.innerHTML = '';
    singleImgDisplay.innerHTML = '';
    out_base64 = []; out_Blobdata = [];
    silmExportHtmlCode.innerText = '';
    silmExportHtml.style.color = '#858796';
    $("#silmimgMsg").html('开始处理...');
    creatDomImg();
  }

  // 全部重置函数
  const silmAllResetfunc = function(){
    drawWidth = 2000;
    imgQuality = 0.2;
    is_balck = false;
    is_locked = false;
    domImg = []; s_imgSize = [];  r_imgSize = [];
    base64dataArr = []; out_base64 = []; out_Blobdata = [];
    temp_out_base64 = [];
    convertType = 'jpg';
    silmimgSaveImg.value = '保存到本地（'+ convertType +'）';
    silmimgInMaxWidth.value = 2000;
    silmRang.value = 20;
    silmimgInQMsg.innerText = 2;
    silmRangName.innerText = '质量 (1 - 10)';
    silmimgCheckJpg.checked = true;
    silmimgCheckPng.checked = false;
    silmimgInBlack.checked = false;
    silmExportHtmlCode.innerText = '';
    silmExportHtml.style.color = '#858796';
    silmExportHtmlCode.innerText = '';
    multipleImgInfo.innerHTML = '';
    singleImgSize.innerHTML = '';
    singleImgDisplay.innerHTML = '';
    $("#silmimgMsg").html('请在上方导入您要压缩的图片');
    silmExportHtmlCode.innerText = '您还没有上传图片...';
  }

  // 把图片弄到 domImg 中
  const creatDomImg = function(){  
    for(let i = 0; i < base64dataArr.length; i++) {
      s_imgSize[i] = parseInt(base64dataArr[i].length / 1024 * 0.75) + "kb";
      domImg[i] = document.createElement("img");
      domImg[i].src = base64dataArr[i];
      domImg[i].onload = function() { canvdraw(i); }
    }
  }

  // 压缩图片
  const canvdraw = function(i) {
    let scale = domImg[i].height / domImg[i].width;
    let domImg_w = (domImg[i].width > drawWidth) ? drawWidth         : domImg[i].width;
    let domImg_h = (domImg[i].width > drawWidth) ? drawWidth * scale : domImg[i].height;
    domImg_w = Math.ceil(domImg_w); domImg_h = Math.ceil(domImg_h);  // 转化为整数，防止出错
    c.width = domImg_w; c.height = domImg_h;
    ctx.drawImage(domImg[i], 0, 0, domImg_w, domImg_h);
    if(is_balck){
      const imgArrData = ctx.getImageData(0, 0, domImg_w, domImg_h);
      for (let i = 0; i < imgArrData.data.length; i += 4) {
          let r = imgArrData.data[i], g = imgArrData.data[i + 1], b = imgArrData.data[i + 2];
          const avg = (r + g + b) / 3;
          imgArrData.data[i] = imgArrData.data[i + 1] = imgArrData.data[i + 2] = avg;
      }
      ctx.putImageData(imgArrData, 0, 0);
    }
    let newblob, png, dta;
    if(convertType === 'png'){  // png 格式的压缩
      dta = ctx.getImageData(0, 0, domImg_w, domImg_h).data;
      try{ png = UPNG.encode([dta.buffer], domImg_w, domImg_h, imgQuality); } catch(e) {
        $("#silmimgMsg").html('出错了，请调整配置后重试');
        is_locked = false;
        return false;
      }
      newblob = new Blob([png], {type:'image/png'});
      out_base64[i] = URL.createObjectURL(newblob);  // 请注意，这个时候 out_base64 里存的并不是 base64（改名字会很麻烦）
      out_Blobdata[i] = newblob;
    } else if(convertType === 'jpg') {  // jpg 格式的压缩
      out_base64[i] = c.toDataURL('image/jpeg', imgQuality);
    } 
    singleImgDisplay = document.getElementById("singleImgDisplay");
    let newImgEle = document.createElement('img');
    newImgEle.src = out_base64[i];
    newImgEle.alt = 'Demo Image';
    newImgEle.style.maxWidth = '100%';
    if(convertType === 'png'){ r_imgSize = parseInt(newblob.size / 1024) + "kb";}
    else if(convertType === 'jpg'){ r_imgSize = parseInt(out_base64[i].length / 1024 * 0.75) + "kb";}
    if(base64dataArr.length === 1) {
      singleImgSize.innerHTML = s_imgSize[i] + ' -> ' + r_imgSize;
      singleImgDisplay.appendChild(newImgEle).onload = function(){
        silmImgTool.style.height = newImgEle.height + 'px';
        singleImgDisplay.onclick = function(){  // 单张图片时，在新窗口打开图片
          let imgTempBlob = new Blob(['<img style="max-width:100%" src="'+ out_base64[i] +'">'], {type: 'text/html'});
          window.open(window.URL.createObjectURL(imgTempBlob), '_blank');
        }
      }  // 在前端显示图片出来
    } else {
      silmimgSaveImg.value = '保存到本地（zip）';
      silmImgTool.style.height = '300px';
      singleImgSize.innerHTML = '<span style="color:#c5c5c5;user-select:none;" id="openAllDemoImg">点下面的条目可逐个展开预览,<br>点我可全部展开（关闭）预览</span>';
      multipleImgInfo.innerHTML += '<div class="silmimg-sizeDisplay" sizeOpenImgId="'+ i +'">' + s_imgSize[i] + " -> " + r_imgSize + '</div>';
      $('.silmimg-sizeDisplay').click(function(thisEle) {
        let displayBase64Id = thisEle.target.getAttribute('sizeOpenImgId');
        if($('.demo-muli' + displayBase64Id).length > 0){ $('.demo-muli' + displayBase64Id).remove();} 
        else {
          if(displayBase64Id === null) return;
          thisEle.target.innerHTML += `
            <span class='demo-muli demo-muli${displayBase64Id}'>↓</span>
            <div  class='demo-muli demo-muli-img demo-muli${displayBase64Id}'>
              <img src='${out_base64[displayBase64Id]}' id='demoimgid${displayBase64Id}' style="max-width:100%" alt='' />
            </div>
          `;
          document.getElementById('demoimgid' + displayBase64Id).onclick = function(e){  // 多张图片时，在新窗口打开图片
            let imgTempBlob = new Blob(['<img style="max-width:100%" src="'+ out_base64[displayBase64Id] +'">'], {type: 'text/html'});
            window.open(window.URL.createObjectURL(imgTempBlob), '_blank');
          }
        }
      });
      openAllDemoImg.onclick = function(){  // 多张图片，展开所有的图片
        if($('.demo-muli-img').length > 0 && $('.demo-muli-img').length < $('.silmimg-sizeDisplay').length){ $('.demo-muli').remove();}
        $('.silmimg-sizeDisplay').trigger('click');
      }
    }
    if(i === (domImg.length - 1) && is_locked){
      is_locked = false;
      if(convertType === 'png'){  // png 模式
        for(let i = 0; i < out_base64.length; i++){
          $("#silmimgMsg").html('正在转化，请勿点击下载或上传');
          blobToBase64(out_Blobdata[i], function(result){
            out_base64[i] = result;
            if(i === (out_base64.length - 1)) { $("#silmimgMsg").html('处理完成！');}
          });
        }
      } else { $("#silmimgMsg").html('处理完成！'); }
    } else {
      $("#silmimgMsg").html('处理中（' + (i+1) + '/' + domImg.length + '）');
    }
      
  }

  // 用户点击 file 表单后
  const getImgFile = function getImgFile(source){  
    base64dataArr = [];
    s_imgSize = [];
    domImg = [];
    silmimgSaveImg.value = '保存到本地（'+ convertType +'）';
    let completedCount = 0; 
    let fileCount = source.files.length;
    if(fileCount < 1) return;
    $("#silmimgMsg").attr('id', 'silmimgMsgTemp');
    $("#silmimgMsgTemp").html('读取文件，请等待...');
    for(let i = 0; i < fileCount; i++){
      (function(index){
        let file = source.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
          base64dataArr.push(this.result);  
          completedCount++;
          let tip = (fileCount > 30) ? '（卡顿是正常现象）' : '';
          $("#silmimgMsgTemp").html('读取文件中（' + (index + 1) + '/' + fileCount + '），请等待' + tip + '...'); 
          if (completedCount === fileCount) { $("#silmimgMsgTemp").attr('id', 'silmimgMsg'); drawImg();}  
        };
      })(i);
    }
  }

  // blob 变为 base64（转换 png 时使用）
  const blobToBase64 = function(blob, callback) {  
    const reader = new FileReader();  
    reader.onloadend = function() { callback(reader.result);};  
    reader.readAsDataURL(blob);  
  }  

  // 用户在界面自定义配置
  const re_config = function(){
    if(is_locked) return;
    drawWidth = silmimgInMaxWidth.value;
    is_balck = silmimgInBlack.checked;
    convertType = document.querySelector('input[name="convertType"]:checked').value;
    silmimgSaveImg.value = '保存到本地（'+ convertType +'）';
    if(convertType === 'png'){
      silmRangName.innerText = '颜色 (1 - 255)'
      silmRang.min = 1;
      silmRang.max = 255;
      imgQuality = Math.floor(silmRang.value);
      silmimgInQMsg.innerHTML = imgQuality;
    } else if(convertType === 'jpg'){
      silmRangName.innerText = '质量 (1 - 10)';
      silmRang.min = 10;
      silmRang.max = 100;
      imgQuality = Math.floor(silmRang.value) / 100;
      silmimgInQMsg.innerHTML = (imgQuality * 10).toString().match(/^\d+(?:\.\d{0,1})?/);
    }
    if(typeof base64dataArr === 'undefined') return;
    drawImg();
  }

  // 本地下载处理后的图片
  const base64ToFile_download = function(base, fileName) {
    if(typeof base === 'undefined' || base.length === 0) return
    if(base.length > 1){
      const zip = new JSZip();
      base.forEach((base64, index) => {  
        const parts = base64.split(';base64,');  
        const contentType = parts[0].split(":")[1];  
        const raw = window.atob(parts[1]);  
        const rawLength = raw.length;  
        const uInt8Array = new Uint8Array(rawLength); 
        for (let i = 0; i < rawLength; ++i) {  
            uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType }); 
        zip.file(`download${index}.${convertType}`, blob, { binary: true });
        $("#silmimgMsg").html('打包中（' + (index+1) + '/'+ base.length +'）');
      });
      zip.generateAsync({ type: "blob" })
        .then(function (content) { 
            saveAs(content, "download-images.zip");
            $("#silmimgMsg").html('已将图片打包成 zip 下载到本地');
      });
    } else {
      const arr = base[0].split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) { u8arr[n] = bstr.charCodeAt(n); }
      if (window.navigator.msSaveBlob) {
        try {
          const blobObject = new Blob([u8arr], { type: mime });
          window.navigator.msSaveBlob(blobObject, 'info.xls');
        } catch (e) { console.log(e); }
      } else {
        const url = window.URL.createObjectURL(new Blob([u8arr], { type: `image/${convertType}` }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      $("#silmimgMsg").html('已将图片下载到本地');
    }
  }

  // 二进制化 base64
  const base64toFile = function(base64Data) {
    let split = base64Data.split(',');
    let bytes = window.atob(split[1]);
    let fileType = split[0].match(/:(.*?);/)[1];
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) { ia[i] = bytes.charCodeAt(i); }
    return new Blob([ab], { type: fileType});
  }

  // 上传动作
  const silmimg_upload = function(isInsert = false, isMuli = false){
    if (out_base64.length === 0) { $("#silmimgMsg").html('您还没有压缩图片'); return false; }
    if (out_base64 === temp_out_base64) { $("#silmimgMsg").html('此内容已在上一次上传'); return false; }
    temp_out_base64 = out_base64;
    $("#silmimgMsg").html('请等待...');
    if(out_base64.length === 1){
      let formdate = base64toFile(out_base64[0]);
      silmimg_uploadImg(formdate, isInsert, 1);
    } else {
      for(let index = 0; index < out_base64.length; index++) {
        let formdate = base64toFile(out_base64[index]);
        if(index === (out_base64.length - 1)){  silmimg_uploadImg(formdate, isInsert, (index+1)); }  // 即上传，又获取
        else { silmimg_uploadImg(formdate, isInsert);}  // 只上传，不获取（只在最后一张图的时候，申请获取图片的链接）
      }
    }
  }

  // 异步上传图片并写入编辑器
  const silmimg_uploadImg = function (img, isInsert = false, isMuli = false) {
    let formData = new FormData();
    let imgName = "图片压缩器" + new Date().getTime() + "." + convertType;
    let thisEditor = Editor;
    let postUrl = './media.php?action=upload';  // emlog 的图片上传地址
    let emMediaPhpUrl = "../content/plugins/silmimg/getMediaImg.php?action=lib&count=";  // emlog 的资源库地址,用于异步获取上传后的图片数据
    formData.append('file', img, imgName);
    $.ajax({
      url: postUrl, type: 'post', data: formData, processData: false, contentType: false, xhr: function () {
        let xhr = $.ajaxSettings.xhr();
        return xhr;
      }, success: function (result) {
        let imgUrl, thumbImgUrl;
        $("#silmimgMsg").html('上传成功！');
        if(isMuli ===  false) return;
        $.get(emMediaPhpUrl + isMuli, function (resp) {  // 异步获取结果,追加到编辑器
          let image = resp.data.images;
          if(image[0] && isMuli > 0) {
            let temp_silmExportHtmlCode = '';
            for(let index = 0; index < isMuli; index++){
              imgUrl = image[index].media_url;
              thumbImgUrl = image[index].media_icon;
              temp_silmExportHtmlCode += silmimgConfig.insertHtmlMod.replace(/{imgUrl}/g, imgUrl).replace(/{thumbImgUrl}/g, thumbImgUrl)+'\n\n';
            }
            silmExportHtmlCode.innerText = temp_silmExportHtmlCode;
            silmExportHtml.style.color = 'red';
            if(isInsert === false) return false
            thisEditor.insertValue(temp_silmExportHtmlCode);
            return true;
          }
          $("#silmimgMsg").html('获取结果失败！');
        })
      }, error: function (result) { alert('上传失败,原因未知'); $("#silmimgMsg").html('上传失败,原因未知'); }
    })
  }

  // 悬浮按钮的点击和拖动事件
  silmIBtn.onmousedown = function(e){
    let x = e.clientX - silmIBtn.offsetLeft;
    let y = e.clientY - silmIBtn.offsetTop;
    let oldColor = silmIBtn.style.color;
    let isMove = false;
    silmIBtn.style.color = '#ff8d8d';
    silmIBtn.style.borderColor = '#ff8d8d';
    const handMove = function(e){
      isMove = true;
      silmIBtn.style.left = (e.clientX - x) + 'px';
      silmIBtn.style.top = (e.clientY - y) + 'px';
      silmIBtn.onclick = null;
    }
    const handUP = function(){ 
      document.removeEventListener('mousemove', handMove);
      document.removeEventListener('mouseup', handUP);
      silmIBtn.style.color = oldColor;
      silmIBtn.style.borderColor = oldColor;
      if(isMove === false) { (silmimgModal.style.display !== 'block') ? $('#silmimgModal').modal('show') : $('#silmimgModal').modal('hide') }
    }
    document.addEventListener('mousemove', handMove);
    document.addEventListener('mouseup', handUP);  
  }
  
  // 各种点击、改动事件
  silmimgFile.onchange = function(event){getImgFile(event.target)}
  silmimgUploadInsert.onclick = function(event){silmimg_upload(true)}
  silmimgOnlyUpload.onclick = function(event){silmimg_upload()}
  silmimgSaveImg.onclick = function(event){base64ToFile_download(out_base64, 'download.' + convertType)}
  silmimgInMaxWidth.onchange = function(event){re_config()}
  silmRang.onchange = function(event){re_config()}
  silmimgInBlack.onchange = function(event){re_config()}
  silmimgCheckJpg.onchange = function(event){re_config()}
  silmimgCheckPng.onchange = function(event){re_config()}
  silmExportHtmlCode.onclick = function(event){copyToClipboard(event.target)}
  silmAllReset.onclick = function(event){silmAllResetfunc()}

  // 将元素内的文本复制到剪切板
  const copyToClipboard = function(ele) {  
      navigator.clipboard.writeText(ele.innerText).then(function() {  
        $("#silmimgMsg").html('复制成功！请粘贴至您的编辑器！');
      }).catch(function(err) { alert('无法复制文本: ', err); });  
  }

  // 粘贴事件后：获取粘贴图片，把 base64 数据扔给 drawImg()
  document.getElementById("output").addEventListener("paste", function (e) {
    $("#silmimgMsg").html('请等待...');
    base64dataArr = [];
    s_imgSize = [];
    domImg = [];
    silmimgSaveImg.value = '保存到本地（'+ convertType +'）';
    if ( !(e.clipboardData && e.clipboardData.items) ) return;
    let pasteData = e.clipboardData || window.clipboardData
    pasteAnalyseResult = new Array
    for(let i = 0; i < pasteData.items.length; i++) {
        let item = pasteData.items[i];
        if((item.kind == "file") && (item.type.match('^image/'))){
            let imgData = item.getAsFile();
            if (imgData.size === 0) return;
            let reader = new FileReader(); reader.readAsDataURL(imgData);
            reader.onload = function(){ base64dataArr[0] = this.result; drawImg(); }
            break;
        };
    }
  }, false);

  // 拖拽文件上传
  silmimgDropzone.ondragover = function(e){
    e.preventDefault();
    e.stopPropagation();
    e.target.style.backgroundColor = 'rgb(255, 141, 141)';
    return false;
  }
  silmimgDropzone.ondragleave = function(e){e.target.style.backgroundColor = 'white';}
  silmimgDropzone.ondrop = function(e){
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) { getImgFile(e.dataTransfer);}
    e.target.style.backgroundColor = 'white';
    return false;  
  }

  // 根据插件配置来决定是否显示悬浮按钮
  if(silmimgConfig.isDisplayFBtn === 'n'){  
    silmIBtn.style.display = 'none';
  }
})();