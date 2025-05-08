/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
// 定义PointerLockControls构造函数，接收相机和物理引擎中的刚体作为参数
var PointerLockControls = function ( camera, cannonBody ) {

    var eyeYPos = 2; // 眼睛距离地面的高度为2米
    var velocityFactor = 0.2; // 移动速度因子
    var jumpVelocity = 20; // 跳跃速度
    var scope = this; // 保存当前this引用

    // 创建俯仰(pitch)控制对象，用于控制相机上下旋转
    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera ); // 将相机添加到俯仰对象中

    // 创建偏航(yaw)控制对象，用于控制左右旋转
    var yawObject = new THREE.Object3D();
    yawObject.position.y = 2; // 设置yaw对象高度为2米
    yawObject.add( pitchObject ); // 将pitch对象添加到yaw对象中

    var quat = new THREE.Quaternion();  // 创建四元数，用于旋转计算

    // 移动控制标志
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var canJump = false; // 是否可以跳跃标志

    // 碰撞相关变量
    var contactNormal = new CANNON.Vec3(); // 碰撞法线，指向玩家接触的物体外部
    var upAxis = new CANNON.Vec3(0,1,0); // 上方向轴
    
    // 为刚体添加碰撞事件监听器
    cannonBody.addEventListener("collide",function(e){
        var contact = e.contact;

        // contact.bi和contact.bj是碰撞的两个刚体，contact.ni是碰撞法线
        // 我们需要判断哪个是玩家刚体
        if(contact.bi.id == cannonBody.id)  // 如果bi是玩家刚体，翻转碰撞法线
            contact.ni.negate(contactNormal);
        else
            contactNormal.copy(contact.ni); // 否则直接复制法线

        // 如果碰撞法线与上方向轴的点积大于0.5，说明玩家站在地面上
        if(contactNormal.dot(upAxis) > 0.5) // 使用0.5作为阈值
            canJump = true; // 允许跳跃
    });

    var velocity = cannonBody.velocity; // 获取刚体的速度

    var PI_2 = Math.PI / 2; // 90度，用于限制俯仰角度

    // 鼠标移动事件处理函数
    var onMouseMove = function ( event ) {
        if ( scope.enabled === false ) return; // 如果控件未启用则返回

        // 获取鼠标移动量，兼容不同浏览器
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        // 根据鼠标移动量旋转yaw和pitch对象
        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        // 限制俯仰角度在-90度到90度之间
        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    };

    // 键盘按下事件处理函数
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // 上箭头
            case 87: // W键
                moveForward = true; // 设置向前移动标志
                break;

            case 37: // 左箭头
            case 65: // A键
                moveLeft = true; // 设置向左移动标志
                break;

            case 40: // 下箭头
            case 83: // S键
                moveBackward = true; // 设置向后移动标志
                break;

            case 39: // 右箭头
            case 68: // D键
                moveRight = true; // 设置向右移动标志
                break;

            case 32: // 空格键
                if ( canJump === true ){ // 如果可以跳跃
                    velocity.y = jumpVelocity; // 设置y方向速度为跳跃速度
                }
                canJump = false; // 跳跃后暂时不能再次跳跃
                break;
        }
    };

    // 键盘释放事件处理函数
    var onKeyUp = function ( event ) {
        switch( event.keyCode ) {
            case 38: // 上箭头
            case 87: // W键
                moveForward = false; // 取消向前移动标志
                break;

            case 37: // 左箭头
            case 65: // A键
                moveLeft = false; // 取消向左移动标志
                break;

            case 40: // 下箭头
            case 83: // S键
                moveBackward = false; // 取消向后移动标志
                break;

            case 39: // 右箭头
            case 68: // D键
                moveRight = false; // 取消向右移动标志
                break;
        }
    };

    // 添加事件监听器
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false; // 控件初始状态为禁用

    // 获取yaw对象的方法
    this.getObject = function () {
        return yawObject;
    };

    // 获取当前方向的方法
    this.getDirection = function(targetVec){
        targetVec.set(0,0,-1); // 设置初始方向为z轴负方向
        quat.multiplyVector3(targetVec); // 应用当前旋转
    }

    // 更新函数，在每一帧调用
    var inputVelocity = new THREE.Vector3(); // 输入速度
    var euler = new THREE.Euler(); // 欧拉角
    this.update = function ( delta ) {
        if ( scope.enabled === false ) return; // 如果控件未启用则返回

        delta *= 0.1; // 调整时间增量

        inputVelocity.set(0,0,0); // 重置输入速度

        // 根据按键状态设置输入速度
        if ( moveForward ){
            inputVelocity.z = -velocityFactor * delta;
        }
        if ( moveBackward ){
            inputVelocity.z = velocityFactor * delta;
        }

        if ( moveLeft ){
            inputVelocity.x = -velocityFactor * delta;
        }
        if ( moveRight ){
            inputVelocity.x = velocityFactor * delta;
        }

        // 将输入速度转换为世界坐标
        euler.x = pitchObject.rotation.x; // 俯仰角
        euler.y = yawObject.rotation.y; // 偏航角
        euler.order = "XYZ"; // 设置旋转顺序
        quat.setFromEuler(euler); // 从欧拉角设置四元数
        inputVelocity.applyQuaternion(quat); // 应用旋转到输入速度

        // 将输入速度添加到刚体速度
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;

        // 更新yaw对象位置以匹配刚体位置
        yawObject.position.copy(cannonBody.position);
    }
};
