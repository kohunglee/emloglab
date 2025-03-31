from PIL import ImageGrab, Image  
import os
import time
import tkinter as tk
from tkinter import messagebox 
from datetime import datetime
import cv2

global_folder = 'myscreen'  # 文件夹
global_pic_name_i = 100000000  # 截屏图像名称序列
global_pic_time = 5000  # 截屏的时间差（5000 的话，一小时大概 30 秒）
global_afterid = None  # after id
global_unixtime = None  # unix 时间戳

# 截屏并保存的函数
def takeScrPic(folder, picName):
    screenshot_folder = folder  # 文件夹
    screenshot_name = picName  # 截屏图像名称
    new_width = 1080  # 新的宽度
    pic_quality = 45 # 截图的图片质量（1~95）
    if not os.path.exists(screenshot_folder):  # 文件夹不存在就建立一个
        os.makedirs(screenshot_folder)
    screenshot = ImageGrab.grab()  # 截屏命令 
    width, height = screenshot.size  # 宽高计算
    new_height = int(height * (new_width / width))   
    resized_screenshot = screenshot.resize((new_width, new_height))  # 根据新宽高来转换图片 
    resized_screenshot = resized_screenshot.convert('RGB')  # rgba 变成 rgb
    screenshot_path = os.path.join(screenshot_folder, screenshot_name)   
    resized_screenshot.save(screenshot_path, 'JPEG', quality=pic_quality)  # 保存到目录
    print(f'The resized screenshot is {new_width} wide x {new_height} tall and saved as {screenshot_path}')  # 打印结果
   
# 程序的界面
def makeUI():
    root = tk.Tk()
    root.title('screenRec')
    root.attributes('-topmost', True) # 将窗口置顶
    width = 200
    height = 200
    screenwidth = root.winfo_screenwidth()
    screenheight = root.winfo_screenheight()
    size_geo = '%dx%d+%d+%d' % (width, height, (screenwidth-width)/2, (screenheight-height)/2 - 70)
    root.geometry(size_geo)
    # root.resizable(False, False) 
    label = tk.Label(root, text='输入项目名称，点击开始录制')  
    label.pack()
    itemNameInput = tk.Entry(root)  
    itemNameInput.pack(pady=10)  
    startButton = tk.Button(root, text='开始录制', command=clickDef)
    startButton.pack()
    endButton = tk.Button(root, text='停止录制', command=stopAfter, state='disabled')
    endButton.pack()
    convertButton = tk.Button(root, text='转换成视频', command=item2video, state='disabled')
    convertButton.pack()
    rmPicFolderButton = tk.Button(root, text='删除图片文件夹', command=rmPicFolder, state='disabled')
    rmPicFolderButton.pack()
    return root, label, itemNameInput, startButton, endButton, convertButton, rmPicFolderButton

# 删除一个文件夹
def delete_directory(path):
    if not isinstance(path, str):  
        raise ValueError("Path must be a string.")   
    if not os.path.exists(path):  
        print(f"The directory {path} does not exist.")
        messagebox.showerror('error', '文件夹不存在')
        return 0
    for name in os.listdir(path): 
        full_path = os.path.join(path, name) 
        if os.path.isfile(full_path) or os.path.islink(full_path):  
            os.remove(full_path)
        elif os.path.isdir(full_path):  
            delete_directory(full_path) 
    try:  
        os.rmdir(path)  
        print(f"Successfully deleted the directory: {path}")  
    except OSError as e:  
        print(f"Error occurred while deleting the directory: {path} - {e.strerror}")
    label.config(text = '删除完成')
    rmPicFolderButton.config(state='disabled')


# 单击删除文件夹按钮后
def rmPicFolder():
    itemProjName = itemNameInput.get()
    delete_directory('./' + itemProjName)
    return 0

# 开始录制的点击事件
def clickDef():
    global global_pic_name_i, global_afterid, global_unixtime
    itemProjName = itemNameInput.get()
    if not itemProjName:
        messagebox.showerror('error', '项目名称不能为空！')
        return 0
    if not global_unixtime:
        global_unixtime = int(time.time())
    takeScrPic(itemProjName, itemProjName + str(global_pic_name_i) + '.jpg')
    global_pic_name_i = global_pic_name_i + 1
    label.config(text='已截 ' + str(global_pic_name_i - 100000000) + ' 张，' + '已录制' + toGoodTime( int(time.time()) - global_unixtime ))
    global_afterid = root.after(global_pic_time, clickDef)
    endButton.config(state='normal')
    startButton.config(state='disabled')

# 将秒转化为分秒格式
def toGoodTime(sec):
    minutes = str(sec // 60)
    remaining_seconds = str(sec % 60)
    return str(' ' + minutes+' 分 '+ remaining_seconds +' 秒')

# 停止录制
def stopAfter():
    root.after_cancel(global_afterid)
    endButton.config(state='disabled')
    convertButton.config(state='normal')

# 点击 转化成视频 按钮
def item2video():
    itemProjName = itemNameInput.get()
    convertButton.config(state='disabled')
    convert2Video(itemProjName, itemProjName + '.mp4')

# 将序列转化为视频
def convert2Video(picdir, outputname, myfps=25):
    im_dir = picdir
    save_video_dir = './video_output/'
    if not os.path.exists(save_video_dir):
        os.makedirs(save_video_dir)
    fps = myfps
    frames = sorted(os.listdir(im_dir))  # 提取序列
    img = cv2.imread(os.path.join(im_dir, frames[0]))
    img_size = (img.shape[1], img.shape[0])
    seq_name = outputname
    video_dir = os.path.join(save_video_dir, seq_name)
    # fourcc = cv2.VideoWriter_fourcc('M', 'P', '4', 'V')
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    videowriter = cv2.VideoWriter(video_dir, fourcc, fps, img_size)
 
    for frame in frames:
        f_path = os.path.join(im_dir, frame)
        image = cv2.imread(f_path)
        videowriter.write(image)
        print(frame + ' has been written!')
    videowriter.release()
    label.config(text = '转化完成')
    rmPicFolderButton.config(state='normal')
    # ↑↑↑↑↑ convert2Video('myscreen', 'out.mp4') 本函数的示例用法 ↑↑↑↑↑

root, label, itemNameInput, startButton, endButton, convertButton, rmPicFolderButton = makeUI()  
root.mainloop()
