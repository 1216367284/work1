// GaodeMapService.js - 高德地图服务适配器
import IMapService from './IMapService'

class GaodeMapService extends IMapService {
  constructor() {
    super()
    this.map = null
    this.markers = new Map()
    this.infoWindows = new Map()
    this.eventListeners = new Map()
    this.listenerIdCounter = 0
    this.controlPoints = new Map()
    this.isEditMode = false
  }

  /**
   * 初始化高德地图
   * @param {string} containerId - 地图容器ID
   * @param {Object} options - 地图初始化选项
   * @returns {Promise} 初始化完成的Promise
   */
  async initMap(containerId, options = {}) {
    return new Promise((resolve, reject) => {
      // 检查是否已加载高德地图SDK
      if (typeof AMap === 'undefined') {
        // 动态加载高德地图SDK
        const script = document.createElement('script')
        script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${options.key || 'YOUR_AMAP_KEY'}`
        script.onload = () => {
          this._createMap(containerId, options).then(resolve).catch(reject)
        }
        script.onerror = () => {
          reject(new Error('加载高德地图SDK失败'))
        }
        document.head.appendChild(script)
      } else {
        this._createMap(containerId, options).then(resolve).catch(reject)
      }
    })
  }

  /**
   * 创建地图实例
   * @private
   */
  async _createMap(containerId, options) {
    // 微信小程序环境下的高德地图初始化
    const mapOptions = {
      center: options.center || [117.6758, 36.1699], // 莱芜区中心坐标
      zoom: options.zoom || 13,
      rotateEnable: options.rotateEnable || true,
      pitchEnable: options.pitchEnable || true,
      showCompass: options.showCompass !== undefined ? options.showCompass : true,
      showZoomControl: options.showZoomControl !== undefined ? options.showZoomControl : true,
      showLocationButton: options.showLocationButton !== undefined ? options.showLocationButton : true
    }

    // 在微信小程序中使用map组件
    const mapCtx = wx.createMapContext(containerId, this)
    this.map = mapCtx
    
    // 设置地图参数
    await this.setMapOptions(mapOptions)
    
    return this.map
  }

  /**
   * 设置地图选项
   * @private
   */
  async setMapOptions(options) {
    // 在微信小程序中设置地图参数
    if (this.map && options.center) {
      await this.map.includePoints({
        points: [{ longitude: options.center[0], latitude: options.center[1] }]
      })
    }
    
    // 缩放级别设置
    if (this.map && options.zoom) {
      await this.map.moveToLocation({
        longitude: options.center ? options.center[0] : 117.6758,
        latitude: options.center ? options.center[1] : 36.1699,
        success: () => {
          // 微信小程序map组件的缩放需要在视图更新后操作
          setTimeout(() => {
            this.map.zoomTo({ scale: options.zoom })
          }, 100)
        }
      })
    }
  }

  /**
   * 设置地图中心点
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @param {number} zoom - 缩放级别（可选）
   */
  setCenter(longitude, latitude, zoom = null) {
    if (!this.map) return

    this.map.moveToLocation({
      longitude,
      latitude,
      success: () => {
        if (zoom !== null) {
          setTimeout(() => {
            this.map.zoomTo({ scale: zoom })
          }, 100)
        }
      }
    })
  }

  /**
   * 添加标记点
   * @param {Object} position - 位置对象 {longitude, latitude}
   * @param {Object} options - 标记点选项
   * @returns {string} 标记点ID
   */
  addMarker(position, options = {}) {
    const markerId = `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const marker = {
      id: markerId,
      position,
      iconPath: options.iconPath || '/assets/icons/marker.png',
      width: options.width || 50,
      height: options.height || 50,
      title: options.title || '',
      callout: options.callout || null,
      label: options.label || null
    }
    
    this.markers.set(markerId, marker)
    
    return markerId
  }

  /**
   * 添加多个标记点
   * @param {Array} markers - 标记点数组 [{position, options}]
   * @returns {Array} 标记点ID数组
   */
  addMarkers(markers) {
    return markers.map(({ position, options }) => this.addMarker(position, options))
  }

  /**
   * 移除标记点
   * @param {string} markerId - 标记点ID
   */
  removeMarker(markerId) {
    if (this.markers.has(markerId)) {
      this.markers.delete(markerId)
    }
  }

  /**
   * 清除所有标记点
   */
  clearMarkers() {
    this.markers.clear()
  }

  /**
   * 添加信息窗口
   * @param {string} markerId - 关联的标记点ID
   * @param {Object} content - 窗口内容
   * @returns {string} 信息窗口ID
   */
  addInfoWindow(markerId, content) {
    const infoWindowId = `infoWindow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const infoWindow = {
      id: infoWindowId,
      markerId,
      content,
      position: this.markers.get(markerId)?.position
    }
    
    this.infoWindows.set(infoWindowId, infoWindow)
    
    return infoWindowId
  }

  /**
   * 打开信息窗口
   * @param {string} infoWindowId - 信息窗口ID
   */
  openInfoWindow(infoWindowId) {
    const infoWindow = this.infoWindows.get(infoWindowId)
    if (infoWindow && infoWindow.position) {
      // 在微信小程序中，信息窗口通常通过自定义组件实现
      // 这里仅作记录，实际显示需要在页面中处理
      console.log('Opening info window:', infoWindow)
    }
  }

  /**
   * 关闭信息窗口
   * @param {string} infoWindowId - 信息窗口ID
   */
  closeInfoWindow(infoWindowId) {
    // 在微信小程序中，信息窗口通常通过自定义组件实现
    // 这里仅作记录，实际隐藏需要在页面中处理
  }

  /**
   * 计算两点之间的距离
   * @param {Object} start - 起点 {longitude, latitude}
   * @param {Object} end - 终点 {longitude, latitude}
   * @returns {number} 距离（米）
   */
  calculateDistance(start, end) {
    const { longitude: lon1, latitude: lat1 } = start
    const { longitude: lon2, latitude: lat2 } = end
    
    const R = 6371e3 // 地球半径（米）
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180
    
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c
  }

  /**
   * 搜索地点
   * @param {string} keyword - 搜索关键词
   * @param {Object} options - 搜索选项
   * @returns {Promise<Array>} 搜索结果数组
   */
  async search(keyword, options = {}) {
    // 模拟搜索结果，实际需要调用高德地图的搜索API
    console.log('Searching with keyword:', keyword)
    return []
  }

  /**
   * 规划路线
   * @param {Object} start - 起点 {longitude, latitude}
   * @param {Object} end - 终点 {longitude, latitude}
   * @param {string} mode - 出行方式（driving, walking, transit）
   * @returns {Promise<Object>} 路线规划结果
   */
  async planRoute(start, end, mode = 'driving') {
    // 模拟路线规划，实际需要调用高德地图的路线规划API
    console.log('Planning route:', { start, end, mode })
    return {
      distance: this.calculateDistance(start, end),
      duration: Math.floor(this.calculateDistance(start, end) / 1000 * 60), // 假设平均速度1km/min
      path: [start, end]
    }
  }

  /**
   * 绘制路线
   * @param {Array} path - 路线点数组 [{longitude, latitude}]
   * @param {Object} options - 路线绘制选项
   * @returns {string} 路线ID
   */
  drawRoute(path, options = {}) {
    // 在微信小程序中，路线绘制需要通过map组件的polyline属性实现
    const routeId = `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('Drawing route:', { path, options })
    return routeId
  }

  /**
   * 获取当前地图中心点
   * @returns {Object} 中心点坐标 {longitude, latitude}
   */
  getCenter() {
    // 需要通过map context获取，这里返回默认值
    return { longitude: 117.6758, latitude: 36.1699 }
  }

  /**
   * 获取当前缩放级别
   * @returns {number} 缩放级别
   */
  getZoom() {
    // 需要通过map context获取，这里返回默认值
    return 13
  }

  /**
   * 设置缩放级别
   * @param {number} zoom - 缩放级别
   */
  setZoom(zoom) {
    if (this.map) {
      this.map.zoomTo({ scale: zoom })
    }
  }

  /**
   * 监听地图事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件回调
   * @returns {string} 监听器ID
   */
  on(eventName, callback) {
    const listenerId = `listener_${this.listenerIdCounter++}`
    
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Map())
    }
    
    this.eventListeners.get(eventName).set(listenerId, callback)
    
    return listenerId
  }

  /**
   * 移除地图事件监听
   * @param {string} eventName - 事件名称
   * @param {string} listenerId - 监听器ID
   */
  off(eventName, listenerId) {
    if (this.eventListeners.has(eventName)) {
      this.eventListeners.get(eventName).delete(listenerId)
    }
  }

  /**
   * 获取地图实例
   * @returns {Object} 原生地图实例
   */
  getMapInstance() {
    return this.map
  }

  /**
   * 获取所有标记点数据
   * @returns {Array} 标记点数据数组
   */
  getMarkersData() {
    return Array.from(this.markers.values())
  }

  // ===== MCP (Map Control Point) 相关方法 =====
  
  /**
   * 添加地图控制点
   * @param {Object} position - 位置对象 {longitude, latitude}
   * @param {Object} options - 控制点选项
   * @returns {string} 控制点ID
   */
  addControlPoint(position, options = {}) {
    if (!this.map || !position) return null
    
    const controlPointId = `cp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const defaultOptions = {
      iconPath: '/assets/images/mcp.png',
      iconSize: [32, 32],
      label: '',
      draggable: this.isEditMode,
      ...options
    }
    
    // 在微信小程序中，控制点也使用marker实现
    const markerOptions = {
      longitude: position.longitude,
      latitude: position.latitude,
      iconPath: defaultOptions.iconPath,
      width: defaultOptions.iconSize[0],
      height: defaultOptions.iconSize[1],
      label: defaultOptions.label ? { content: defaultOptions.label } : {},
      draggable: defaultOptions.draggable
    }
    
    // 将控制点添加到内部存储
    this.controlPoints.set(controlPointId, {
      id: controlPointId,
      position,
      options: defaultOptions,
      marker: markerOptions
    })
    
    // 如果是在编辑模式，添加拖拽事件监听
    if (this.isEditMode) {
      this._setupControlPointDraggable(controlPointId)
    }
    
    return controlPointId
  }
  
  /**
   * 添加多个地图控制点
   * @param {Array} controlPoints - 控制点数组 [{position, options}]
   * @returns {Array} 控制点ID数组
   */
  addControlPoints(controlPoints) {
    if (!Array.isArray(controlPoints)) return []
    
    return controlPoints.map(cp => this.addControlPoint(cp.position, cp.options))
  }
  
  /**
   * 移除地图控制点
   * @param {string} controlPointId - 控制点ID
   */
  removeControlPoint(controlPointId) {
    if (this.controlPoints.has(controlPointId)) {
      this.controlPoints.delete(controlPointId)
    }
  }
  
  /**
   * 清除所有地图控制点
   */
  clearControlPoints() {
    this.controlPoints.clear()
  }
  
  /**
   * 更新地图控制点
   * @param {string} controlPointId - 控制点ID
   * @param {Object} options - 新的控制点选项
   */
  updateControlPoint(controlPointId, options) {
    if (!this.controlPoints.has(controlPointId)) return
    
    const controlPoint = this.controlPoints.get(controlPointId)
    controlPoint.options = { ...controlPoint.options, ...options }
    
    // 更新内部存储
    this.controlPoints.set(controlPointId, controlPoint)
  }
  
  /**
   * 移动地图控制点
   * @param {string} controlPointId - 控制点ID
   * @param {Object} newPosition - 新位置 {longitude, latitude}
   */
  moveControlPoint(controlPointId, newPosition) {
    if (!this.controlPoints.has(controlPointId) || !newPosition) return
    
    const controlPoint = this.controlPoints.get(controlPointId)
    controlPoint.position = newPosition
    
    // 更新内部存储
    this.controlPoints.set(controlPointId, controlPoint)
  }
  
  /**
   * 获取所有地图控制点
   * @returns {Array} 控制点数组
   */
  getControlPoints() {
    return Array.from(this.controlPoints.values())
  }
  
  /**
   * 激活地图控制点编辑模式
   * @param {Object} options - 编辑选项
   */
  activateControlPointEdit(options = {}) {
    this.isEditMode = true
    
    // 将所有控制点设置为可拖拽
    this.controlPoints.forEach((cp, id) => {
      this.updateControlPoint(id, { draggable: true })
      this._setupControlPointDraggable(id)
    })
  }
  
  /**
   * 取消地图控制点编辑模式
   */
  deactivateControlPointEdit() {
    this.isEditMode = false
    
    // 将所有控制点设置为不可拖拽
    this.controlPoints.forEach((cp, id) => {
      this.updateControlPoint(id, { draggable: false })
    })
  }
  
  /**
   * 设置控制点拖拽功能
   * @private
   */
  _setupControlPointDraggable(controlPointId) {
    // 在微信小程序中，需要通过地图组件的事件来处理拖拽
    if (this.isEditMode && this.controlPoints.has(controlPointId)) {
      console.log(`控制点 ${controlPointId} 已设置为可拖拽`)
    }
  }
}

export default GaodeMapService