class QuaternionConverter {
    /**
     * 将四元数转换为欧拉角（弧度）
     * @param {Object} q - 四元数 {x, y, z, w}
     * @returns {Object} 欧拉角 {x, y, z}（弧度）
     */
    static toEulerRadians(q) {
      // 绕X轴旋转（roll）
      const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
      const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
      const roll = Math.atan2(sinr_cosp, cosr_cosp);
  
      // 绕Y轴旋转（pitch）
      const sinp = 2 * (q.w * q.y - q.z * q.x);
      let pitch;
      if (Math.abs(sinp) >= 1) {
        pitch = Math.sign(sinp) * Math.PI / 2; // 处理万向节锁
      } else {
        pitch = Math.asin(sinp);
      }
  
      // 绕Z轴旋转（yaw）
      const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
      const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
      const yaw = Math.atan2(siny_cosp, cosy_cosp);
  
      return { x: roll, y: pitch, z: yaw };
    }
  
    /**
     * 将四元数转换为欧拉角（角度）
     * @param {Object} q - 四元数 {x, y, z, w}
     * @returns {Object} 欧拉角 {x, y, z}（角度）
     */
    static toEulerDegrees(q) {
      const radians = this.toEulerRadians(q);
      return {
        x: this.radToDeg(radians.x),
        y: this.radToDeg(radians.y),
        z: this.radToDeg(radians.z)
      };
    }
  
    /**
     * 将欧拉角（角度）转换为四元数
     * @param {Object} euler - 欧拉角 {x, y, z}（角度）
     * @returns {Object} 四元数 {x, y, z, w}
     */
    static fromEulerDegrees(euler) {
      const roll = this.degToRad(euler.x) / 2;
      const pitch = this.degToRad(euler.y) / 2;
      const yaw = this.degToRad(euler.z) / 2;
  
      const cr = Math.cos(roll);
      const sr = Math.sin(roll);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
  
      const q = {
        x: sr * cp * cy - cr * sp * sy,
        y: cr * sp * cy + sr * cp * sy,
        z: cr * cp * sy - sr * sp * cy,
        w: cr * cp * cy + sr * sp * sy
      };
  
      // 归一化
      const len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
      if (len > 0) {
        q.x /= len;
        q.y /= len;
        q.z /= len;
        q.w /= len;
      }
  
      return q;
    }
  
    /**
     * 将四元数转换为旋转矩阵
     * @param {Object} q - 四元数 {x, y, z, w}
     * @returns {Array} 3x3旋转矩阵
     */
    static toRotationMatrix(q) {
      const x2 = q.x * q.x;
      const y2 = q.y * q.y;
      const z2 = q.z * q.z;
      const xy = q.x * q.y;
      const xz = q.x * q.z;
      const yz = q.y * q.z;
      const wx = q.w * q.x;
      const wy = q.w * q.y;
      const wz = q.w * q.z;
  
      return [
        [1 - 2 * (y2 + z2), 2 * (xy - wz), 2 * (xz + wy)],
        [2 * (xy + wz), 1 - 2 * (x2 + z2), 2 * (yz - wx)],
        [2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (x2 + y2)]
      ];
    }
  
    /**
     * 弧度转角度
     * @param {number} rad - 弧度值
     * @returns {number} 角度值
     */
    static radToDeg(rad) {
      return rad * 180 / Math.PI;
    }
  
    /**
     * 角度转弧度
     * @param {number} deg - 角度值
     * @returns {number} 弧度值
     */
    static degToRad(deg) {
      return deg * Math.PI / 180;
    }
  
    /**
     * 格式化输出四元数
     * @param {Object} q - 四元数 {x, y, z, w}
     * @returns {string} 格式化字符串
     */
    static formatQuaternion(q) {
      return `[${q.x.toFixed(4)}, ${q.y.toFixed(4)}, ${q.z.toFixed(4)}, ${q.w.toFixed(4)}]`;
    }
  
    /**
     * 格式化输出欧拉角
     * @param {Object} euler - 欧拉角 {x, y, z}
     * @returns {string} 格式化字符串
     */
    static formatEuler(euler) {
      return `[X: ${euler.x.toFixed(2)}°, Y: ${euler.y.toFixed(2)}°, Z: ${euler.z.toFixed(2)}°]`;
    }
  }
  
  // 示例用法
  const exampleQuaternion = { x: 0, y: 0.3826834323650898, z: 0, w: 0.9238795325112867 };
  
  console.log("原始四元数:", QuaternionConverter.formatQuaternion(exampleQuaternion));
  
  // 转换为欧拉角
  const eulerDeg = QuaternionConverter.toEulerDegrees(exampleQuaternion);
  console.log("转换为欧拉角:", QuaternionConverter.formatEuler(eulerDeg));
  
  // 转换为旋转矩阵
  const rotationMatrix = QuaternionConverter.toRotationMatrix(exampleQuaternion);
  console.log("转换为旋转矩阵:");
  rotationMatrix.forEach(row => console.log(row.map(n => n.toFixed(4)).join("\t")));
  
  // 从欧拉角转换回四元数
  const newQuaternion = QuaternionConverter.fromEulerDegrees(eulerDeg);
  console.log("从欧拉角转换回四元数:", QuaternionConverter.formatQuaternion(newQuaternion));
  