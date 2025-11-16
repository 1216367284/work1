// BaiduMapService.js - 百度地图服务适配器
import IMapService from './IMapService'

class BaiduMapService extends IMapService {
  constructor() {
    super()
    this.map = null
    this.markers = new Map()
    this.infoWindows = new Map()
    this.eventListeners = new Map()
    this.listenerIdCounter = 0
  }

  /**
   * 初始化百度地图
   * @param {string} containerId - 地图容器ID
   * @param {Object} options - 地图初始化选项
   * @returns {Promise} 初始化完成的Promise
   */
  async initMap(containerId, options = {}) {
    return new Promise((resolve, reject) => {
      // 检查是否已加载百度地图SDK
      if (typeof BMap === 'undefined') {
        // 动态加载百度地图SDK
        const script = document.createElement('script')
        script.src = `https://api.map.baidu.com/api?v=3.0&ak=${options.key || 'YOUR_BAIDU_KEY'}`
        script.onload = () => {
          this._createMap(containerId, options).then(resolve).catch(reject)
        }
        script.onerror = () => {
          reject(new Error('加载百度地图SDK失败'))
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
    // 微信小程序环境下的百度地图初始化
    const mapOptions = {
      center: options.center || [117.6758, 36.1699], // 莱芜区中心坐标
      zoom: options.zoom || 13,
      enableRotate: options.enableRotate !== undefined ? options.enableRotate : true,
      enableScrollWheelZoom: options.enableScrollWheelZoom !== undefined ? options.enableScrollWheelZoom : true,
      enableClick: options.enableClick !== undefined ? options.enableClick : true
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
      // 百度地图需要坐标转换（从WGS84到BD09）
      const bdCenter = await this._wgs84tobd09(options.center[0], options.center[1])
      await this.map.includePoints({
        points: [{ longitude: bdCenter[0], latitude: bdCenter[1] }]
      })
    }
    
    // 缩放级别设置
    if (this.map && options.zoom) {
      const center = options.center || [117.6758, 36.1699]
      const bdCenter = await this._wgs84tobd09(center[0], center[1])
      
      await this.map.moveToLocation({
        longitude: bdCenter[0],
        latitude: bdCenter[1],
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
   * WGS84坐标转百度坐标系BD09
   * @private
   */
  async _wgs84tobd09(lon, lat) {
    // 模拟坐标转换，实际应用中可能需要调用百度地图的坐标转换API
    // 这里使用简化的转换公式
    const x_pi = 3.14159265358979324 * 3000.0 / 180.0
    let x = lon
    let y = lat
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
    let bd_lon = z * Math.cos(theta) + 0.0065
    let bd_lat = z * Math.sin(theta) + 0.006
    
    return [bd_lon, bd_lat]
  }

  /**
   * 百度坐标系BD09转WGS84坐标
   * @private
   */
  async _bd09towgs84(lon, lat) {
    // 模拟坐标转换，实际应用中可能需要调用百度地图的坐标转换API
    // 这里使用简化的转换公式
    const x_pi = 3.14159265358979324 * 3000.0 / 180.0
    let x = lon - 0.0065
    let y = lat - 0.006
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    let gg_lon = z * Math.cos(theta)
    let gg_lat = z * Math.sin(theta)
    
    return [gg_lon, gg_lat]
  }

  /**
   * 设置地图中心点
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @param {number} zoom - 缩放级别（可选）
   */
  async setCenter(longitude, latitude, zoom = null) {
    if (!this.map) return

    // 坐标转换
    const bdCenter = await this._wgs84tobd09(longitude, latitude)
    
    this.map.moveToLocation({
      longitude: bdCenter[0],
      latitude: bdCenter[1],
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
  async addMarker(position, options = {}) {
    const markerId = `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 坐标转换
    const bdPosition = await this._wgs84tobd09(position.longitude, position.latitude)
    
    const marker = {
      id: markerId,
      position: { longitude: bdPosition[0], latitude: bdPosition[1] },
      originalPosition: position, // 保存原始坐标
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
  async addMarkers(markers) {
    const markerIds = []
    for (const { position, options } of markers) {
      const id = await this.addMarker(position, options)
      markerIds.push(id)
    }
    return markerIds
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
      console.log('Opening info window:', infoWindow)
    }
  }

  /**
   * 关闭信息窗口
   * @param {string} infoWindowId - 信息窗口ID
   */
  closeInfoWindow(infoWindowId) {
    // 在微信小程序中，信息窗口通常通过自定义组件实现
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
    // 模拟搜索结果，实际需要调用百度地图的搜索API
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
    // 模拟路线规划，实际需要调用百度地图的路线规划API
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
  async drawRoute(path, options = {}) {
    // 在微信小程序中，路线绘制需要通过map组件的polyline属性实现
    const routeId = `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 坐标转换
    const bdPath = []
    for (const point of path) {
      const bdPoint = await this._wgs84tobd09(point.longitude, point.latitude)
      bdPath.push({ longitude: bdPoint[0], latitude: bdPoint[1] })
    }
    
    console.log('Drawing route:', { path: bdPath, options })
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
   * 获取所有标记点数据（用于渲染）
   * @returns {Array} 标记点数组
   */
  getMarkersData() {
    return Array.from(this.markers.values())
  }
}

export default BaiduMapService