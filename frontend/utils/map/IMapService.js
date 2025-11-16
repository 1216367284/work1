// IMapService.js - 地图服务接口定义

/**
 * 地图服务接口
 * 定义地图服务必须实现的方法
 */
class IMapService {
  /**
   * 初始化地图
   * @param {string} containerId - 地图容器ID
   * @param {Object} options - 地图初始化选项
   * @returns {Promise} 初始化完成的Promise
   */
  async initMap(containerId, options = {}) {
    throw new Error('方法未实现: initMap')
  }

  /**
   * 设置地图中心点
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @param {number} zoom - 缩放级别（可选）
   */
  setCenter(longitude, latitude, zoom = null) {
    throw new Error('方法未实现: setCenter')
  }

  /**
   * 添加标记点
   * @param {Object} position - 位置对象 {longitude, latitude}
   * @param {Object} options - 标记点选项
   * @returns {string} 标记点ID
   */
  addMarker(position, options = {}) {
    throw new Error('方法未实现: addMarker')
  }

  /**
   * 添加多个标记点
   * @param {Array} markers - 标记点数组 [{position, options}]
   * @returns {Array} 标记点ID数组
   */
  addMarkers(markers) {
    throw new Error('方法未实现: addMarkers')
  }

  /**
   * 移除标记点
   * @param {string} markerId - 标记点ID
   */
  removeMarker(markerId) {
    throw new Error('方法未实现: removeMarker')
  }

  /**
   * 清除所有标记点
   */
  clearMarkers() {
    throw new Error('方法未实现: clearMarkers')
  }

  /**
   * 添加信息窗口
   * @param {string} markerId - 关联的标记点ID
   * @param {Object} content - 窗口内容
   * @returns {string} 信息窗口ID
   */
  addInfoWindow(markerId, content) {
    throw new Error('方法未实现: addInfoWindow')
  }

  /**
   * 打开信息窗口
   * @param {string} infoWindowId - 信息窗口ID
   */
  openInfoWindow(infoWindowId) {
    throw new Error('方法未实现: openInfoWindow')
  }

  /**
   * 关闭信息窗口
   * @param {string} infoWindowId - 信息窗口ID
   */
  closeInfoWindow(infoWindowId) {
    throw new Error('方法未实现: closeInfoWindow')
  }

  /**
   * 计算两点之间的距离
   * @param {Object} start - 起点 {longitude, latitude}
   * @param {Object} end - 终点 {longitude, latitude}
   * @returns {number} 距离（米）
   */
  calculateDistance(start, end) {
    throw new Error('方法未实现: calculateDistance')
  }

  /**
   * 搜索地点
   * @param {string} keyword - 搜索关键词
   * @param {Object} options - 搜索选项
   * @returns {Promise<Array>} 搜索结果数组
   */
  async search(keyword, options = {}) {
    throw new Error('方法未实现: search')
  }

  /**
   * 规划路线
   * @param {Object} start - 起点 {longitude, latitude}
   * @param {Object} end - 终点 {longitude, latitude}
   * @param {string} mode - 出行方式（driving, walking, transit）
   * @returns {Promise<Object>} 路线规划结果
   */
  async planRoute(start, end, mode = 'driving') {
    throw new Error('方法未实现: planRoute')
  }

  /**
   * 绘制路线
   * @param {Array} path - 路线点数组 [{longitude, latitude}]
   * @param {Object} options - 路线绘制选项
   * @returns {string} 路线ID
   */
  drawRoute(path, options = {}) {
    throw new Error('方法未实现: drawRoute')
  }

  /**
   * 获取当前地图中心点
   * @returns {Object} 中心点坐标 {longitude, latitude}
   */
  getCenter() {
    throw new Error('方法未实现: getCenter')
  }

  /**
   * 获取当前缩放级别
   * @returns {number} 缩放级别
   */
  getZoom() {
    throw new Error('方法未实现: getZoom')
  }

  /**
   * 设置缩放级别
   * @param {number} zoom - 缩放级别
   */
  setZoom(zoom) {
    throw new Error('方法未实现: setZoom')
  }

  /**
   * 监听地图事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件回调
   * @returns {string} 监听器ID
   */
  on(eventName, callback) {
    throw new Error('方法未实现: on')
  }

  /**
   * 移除地图事件监听
   * @param {string} eventName - 事件名称
   * @param {string} listenerId - 监听器ID
   */
  off(eventName, listenerId) {
    throw new Error('方法未实现: off')
  }

  /**
   * 获取地图实例
   * @returns {Object} 原生地图实例
   */
  getMapInstance() {
    throw new Error('方法未实现: getMapInstance')
  }

  // ===== MCP (Map Control Point) 相关方法 =====
  
  /**
   * 添加地图控制点
   * @param {Object} position - 位置对象 {longitude, latitude}
   * @param {Object} options - 控制点选项
   * @returns {string} 控制点ID
   */
  addControlPoint(position, options = {}) {
    throw new Error('方法未实现: addControlPoint')
  }
  
  /**
   * 添加多个地图控制点
   * @param {Array} controlPoints - 控制点数组 [{position, options}]
   * @returns {Array} 控制点ID数组
   */
  addControlPoints(controlPoints) {
    throw new Error('方法未实现: addControlPoints')
  }
  
  /**
   * 移除地图控制点
   * @param {string} controlPointId - 控制点ID
   */
  removeControlPoint(controlPointId) {
    throw new Error('方法未实现: removeControlPoint')
  }
  
  /**
   * 清除所有地图控制点
   */
  clearControlPoints() {
    throw new Error('方法未实现: clearControlPoints')
  }
  
  /**
   * 更新地图控制点
   * @param {string} controlPointId - 控制点ID
   * @param {Object} options - 新的控制点选项
   */
  updateControlPoint(controlPointId, options) {
    throw new Error('方法未实现: updateControlPoint')
  }
  
  /**
   * 移动地图控制点
   * @param {string} controlPointId - 控制点ID
   * @param {Object} newPosition - 新位置 {longitude, latitude}
   */
  moveControlPoint(controlPointId, newPosition) {
    throw new Error('方法未实现: moveControlPoint')
  }
  
  /**
   * 获取所有地图控制点
   * @returns {Array} 控制点数组
   */
  getControlPoints() {
    throw new Error('方法未实现: getControlPoints')
  }
  
  /**
   * 激活地图控制点编辑模式
   * @param {Object} options - 编辑选项
   */
  activateControlPointEdit(options = {}) {
    throw new Error('方法未实现: activateControlPointEdit')
  }
  
  /**
   * 取消地图控制点编辑模式
   */
  deactivateControlPointEdit() {
    throw new Error('方法未实现: deactivateControlPointEdit')
  }
}

export default IMapService