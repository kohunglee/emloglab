<?php
// 获取上传后的图片 URL 的后端程序，因为 emlog 系统的最低图片获取张数为 12，固重写了一个 

require_once '../../../init.php';
!defined('EMLOG_ROOT') && exit('access deined!');

$sta_cache = $CACHE->readCache('sta');
$user_cache = $CACHE->readCache('user');
$action = Input::getStrVar('action');
loginAuth::checkLogin();
User::checkRolePermission();
$DB = Database::getInstance();
$Media_Model = new Media_Model();
$MediaSortModel = new MediaSort_Model();

if ($action === 'lib') {
    $sid = Input::getIntVar('sid');
    $page = Input::getIntVar('page', 1);
    $uid = User::haveEditPermission() ? null : UID;
    $perPageCount = Input::getIntVar('count');;
    $medias = $Media_Model->getMedias($page, $perPageCount, $uid, $sid);
    $count = $Media_Model->getMediaCount($uid, $sid);
    $ret['hasMore'] = !(count($medias) < $perPageCount);
    foreach ($medias as $v) {
        $data['media_id'] = $v['aid'];
        $data['media_path'] = $v['filepath'];
        $data['media_url'] = rmUrlParams(getFileUrl($v['filepath']));
        $data['media_name'] = subString($v['filename'], 0, 20);
        $data['attsize'] = $v['attsize'];
        $data['media_type'] = '';
        $data['media_icon'] = "./views/images/fnone.png";
        if (isImage($v['mimetype'])) {
            $data['media_icon'] = getFileUrl($v['filepath_thum']);
            $data['media_type'] = 'image';
        } elseif (isZip($v['filename'])) {
            $data['media_icon'] = "./views/images/zip.jpg";
        } elseif (isVideo($v['filename'])) {
            $data['media_type'] = 'video';
            $data['media_icon'] = "./views/images/video.png";
        } elseif (isAudio($v['filename'])) {
            $data['media_type'] = 'audio';
            $data['media_icon'] = "./views/images/audio.png";
        }
        $ret['images'][] = $data;
    }
    Output::ok($ret);
}