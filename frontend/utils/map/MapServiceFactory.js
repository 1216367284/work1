// MapServiceFactory.js - 地图服务工厂类，用于创建不同地图服务的实例
import GaodeMapService from './GaodeMapService'
import BaiduMapService from './BaiduMapService'
import TencentMapService from './TencentMapService'

class MapServiceFactory {
  constructor() {
    this.mapServices = {
      'gaode': GaodeMapService,
      'baidu': BaiduMapService,
      'tencent': TencentMapService
    }
    this.currentService = null
  }

  /**
   * 创建地图服务实例
   * @param {string} mapType - 地图类型 ('gaode', 'baidu', 'tencent')
   * @param {Object} options - 地图服务配置选项
   * @returns {IMapService} 地图服务实例
   */
  createMapService(mapType, options = {}) {
    // 规范化地图类型名称
    const normalizedMapType = mapType.toLowerCase()
    
    // 检查是否支持该地图类型
    if (!this.mapServices.hasOwnProperty(normalizedMapType)) {
      console.warn(`不支持的地图类型: ${mapType}，将使用默认地图服务(高德地图)`)
      this.currentService = new GaodeMapService()
      return this.currentService
    }
    
    // 创建地图服务实例
    const MapServiceClass = this.mapServices[normalizedMapType]
    this.currentService = new MapServiceClass()
    
    return this.currentService
  }

  /**
   * 获取当前地图服务实例
   * @returns {IMapService|null} 当前地图服务实例
   */
  getCurrentService() {
    return this.currentService
  }

  /**
   * 注册自定义地图服务
   * @param {string} mapType - 地图类型名称
   * @param {Class} mapServiceClass - 地图服务类，必须实现IMapService接口
   */
  registerMapService(mapType, mapServiceClass) {
    // 验证地图服务类是否实现了必要的方法
    const requiredMethods = [
      'initMap', 'setCenter', 'addMarker', 'addMarkers', 'removeMarker', 
      'clearMarkers', 'addInfoWindow', 'openInfoWindow', 'closeInfoWindow',
      'calculateDistance', 'search', 'planRoute', 'drawRoute', 'getCenter',
      'getZoom', 'setZoom', 'on', 'off', 'getMapInstance', 'getMarkersData'
    ]
    
    let isValid = true
    for (const method of requiredMethods) {
      if (typeof mapServiceClass.prototype[method] !== 'function') {
        console.error(`自定义地图服务类缺少必要的方法: ${method}`)
        isValid = false
      }
    }
    
    if (isValid) {
      this.mapServices[mapType.toLowerCase()] = mapServiceClass
      console.log(`成功注册自定义地图服务: ${mapType}`)
    }
  }

  /**
   * 获取所有支持的地图类型
   * @returns {Array} 支持的地图类型数组
   */
  getSupportedMapTypes() {
    return Object.keys(this.mapServices)
  }

  /**
   * 检查是否支持指定的地图类型
   * @param {string} mapType - 地图类型
   * @returns {boolean} 是否支持
   */
  isMapTypeSupported(mapType) {
    return this.mapServices.hasOwnProperty(mapType.toLowerCase())
  }
}

// 导出单例实例
const factory = new MapServiceFactory()
export default factory

// 导出工具函数，提供更便捷的使用方式

/**
 * 创建并初始化地图服务的工具函数
 * @param {string} containerId - 地图容器ID
 * @param {string} mapType - 地图类型
 * @param {Object} options - 地图配置选项
 * @returns {Promise<IMapService>} 初始化完成的地图服务实例
 */
export async function createAndInitMap(containerId, mapType = 'gaode', options = {}) {
  const mapService = factory.createMapService(mapType, options)
  await mapService.initMap(containerId, options)
  return mapService
}

/**
 * 切换地图服务类型
 * @param {string} mapType - 新的地图类型
 * @param {string} containerId - 地图容器ID
 * @param {Object} options - 地图配置选项
 * @returns {Promise<IMapService>} 新的地图服务实例
 */
export async function switchMapService(mapType, containerId, options = {}) {
  const currentService = factory.getCurrentService()
  
  // 如果当前已有地图服务，可以进行一些清理工作
  if (currentService) {
    // 清除事件监听等
    console.log('正在切换地图服务...')
  }
  
  // 创建并初始化新的地图服务
  return createAndInitMap(containerId, mapType, options)
}

/**
 * 获取默认配置的地图服务
 * @returns {IMapService} 默认地图服务实例
 */
export function getDefaultMapService() {
  // 如果还没有创建过地图服务，创建默认的高德地图服务
  if (!factory.getCurrentService()) {
    return factory.createMapService('gaode')
  }
  return factory.getCurrentService()
}