<?php

error_reporting(E_ALL);

// 判断字符串中是否包含 xx
function checkStringRegex($str) {
    if (preg_match('/安阳|香港/', $str)) {
        return false;
    }
    return true;
}

// 获取文件夹大小
function getFolderSize($folderPath) {
    $totalSize = 0;
    if (!file_exists($folderPath)) {
        return 0; // 检查文件夹是否存在
    }
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folderPath)) as $file) { // 遍历文件夹
        if ($file->getFilename() != '.' && $file->getFilename() != '..') {
            if ($file->isFile()) {
                $totalSize += $file->getSize();
            }
        }
    }
    return $totalSize;
}

$baseDir = dirname(__DIR__);  // 获取基础目录路径
$totalSize = getFolderSize($baseDir);  // 计算基础目录总大小
$excludedPaths = [  // 定义需要排除的路径
    '/content/cache/' => '主缓存',
    '/en/content/cache/' => '次缓存', 
    '/getinfo/' => 'getinfo文件夹',
    '/sitemap.xml' => '站点地图文件'
];
$excludedSize = 0;  // 计算并累加排除路径的大小
foreach ($excludedPaths as $path => $description) {
    $fullPath = $baseDir . $path;
    $size = is_dir($fullPath) ? getFolderSize($fullPath) : filesize($fullPath);
    $excludedSize += $size;
}
$netSize = $totalSize - $excludedSize;  // 计算净大小

// ip 地址获取
function getIPLocation($ip) {
    $apiUrl = "http://ip-api.com/json/{$ip}?lang=zh-CN";

    try {
        $response = @file_get_contents($apiUrl);
        if ($response === false) {
            return "null";
        }

        $data = json_decode($response, true);
        if ($data['status'] === 'success') {
            return $data['country'] . $data['regionName'] . $data['city'];
        }
        return "null";
    } catch (Exception $e) {
        return "null - " . $e->getMessage();
    }
}

$act = isset($_GET['act']) ? addslashes($_GET['act']) : '';
$info = isset($_GET['info']) ? addslashes($_GET['info']) : 'none';

if ($act == 'read') {
    $data = '';
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
    $time = date('Y-m-d H:i:s');
    $user_agent = substr($_SERVER['HTTP_USER_AGENT'], 0, 100);
    $locationIP = getIPLocation($ip);
    if(checkStringRegex($locationIP)) {
        $totalsize_now = number_format($netSize);
        $data = "$totalsize_now, $info, $time, $locationIP, $ip, $user_agent \n";
    } else {$data = '';}
}

$file = 'visits.php';
file_put_contents($file, $data, FILE_APPEND | LOCK_EX);
$visits = file_get_contents($file);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Visitor Logs</title>
</head>
<body>
<h1>Visitor Logs</h1>
<pre><?php echo htmlspecialchars($visits); ?></pre>
</body>
</html>