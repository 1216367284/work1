// spotMap.js - 景点地图页面
const app = getApp()
import { createAndInitMap } from '../../utils/map/MapServiceFactory'
import { request } from '../../utils/api'
import { showLoading, hideLoading, showToast } from '../../utils/util'

Page({
  data: {
    mapType: 'gaode', // 默认使用高德地图
    mapKey: '', // 地图API密钥
    mapContext: null, // 地图上下文
    mapService: null, // 地图服务实例
    markers: [], // 标记点数据
    spots: [], // 景点数据
    selectedSpot: null, // 选中的景点
    showInfoWindow: false, // 是否显示信息窗口
    loading: false, // 加载状态
    refreshing: false, // 下拉刷新状态
    userLocation: null, // 用户位置
    searchKeyword: '', // 搜索关键词
    currentZoom: 13, // 当前缩放级别
    centerLocation: {
      longitude: 117.6758,
      latitude: 36.1699
    }, // 中心点坐标（莱芜区中心）
    // 控制点相关数据
    controlPoints: [], // 控制点列表
    isEditMode: false, // 是否处于控制点编辑模式
    mcpData: [] // 控制点数据存储
  },

  onLoad(options) {
    // 从全局配置获取地图类型
    this.setData({
      mapType: app.globalData.mapType || 'gaode',
      mapKey: app.globalData.mapKey || ''
    })
    
    // 初始化页面
    this.initPage()
  },

  onShow() {
    // 如果地图类型发生变化，重新初始化地图
    if (this.data.mapType !== app.globalData.mapType) {
      this.setData({
        mapType: app.globalData.mapType
      })
      this.initMap()
    }
  },

  onReady() {
    // 地图组件渲染完成后初始化地图
    this.initMap()
  },

  /**
   * 初始化页面数据
   */
  async initPage() {
    try {
      this.setData({ loading: true })
      
      // 获取用户位置权限
      await this.getUserLocation()
      
      // 加载景点数据
      await this.loadSpots()
      
    } catch (error) {
      console.error('初始化页面失败:', error)
      showToast('页面初始化失败')
    } finally {
      this.setData({ loading: false })
    }
  },

  /**
   * 初始化地图
   */
  async initMap() {
    try {
      // 创建并初始化地图服务
      const mapService = await createAndInitMap('spotMap', this.data.mapType, {
        key: this.data.mapKey,
        center: [this.data.centerLocation.longitude, this.data.centerLocation.latitude],
        zoom: this.data.currentZoom,
        enableRotate: true,
        enableScrollWheelZoom: true
      })
      
      this.setData({ mapService })
      
      // 设置地图事件监听
      this.setupMapListeners()
      
      // 添加景点标记
      if (this.data.spots.length > 0) {
        this.addSpotMarkers()
      }
      
    } catch (error) {
      console.error('初始化地图失败:', error)
      showToast('地图加载失败')
    }
  },

  /**
   * 设置地图事件监听
   */
  setupMapListeners() {
    if (!this.data.mapService) return
    
    // 地图点击事件
    this.data.mapService.on('click', this.handleMapClick.bind(this))
    
    // 地图移动结束事件
    this.data.mapService.on('moveend', this.handleMapMoveEnd.bind(this))
    
    // 地图缩放事件
    this.data.mapService.on('zoomend', this.handleMapZoomEnd.bind(this))
  },

  /**
   * 获取用户位置
   */
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        altitude: true,
        success: (res) => {
          const location = {
            longitude: res.longitude,
            latitude: res.latitude
          }
          
          this.setData({
            userLocation: location,
            centerLocation: location
          })
          
          resolve(location)
        },
        fail: (err) => {
          console.warn('获取位置失败，使用默认位置:', err)
          showToast('无法获取您的位置，使用默认位置')
          resolve(null)
        }
      })
    })
  },

  /**
   * 加载景点数据
   */
  async loadSpots() {
    try {
      showLoading('加载景点数据...')
      
      // 调用API获取景点列表
      const response = await request('/spots', 'GET', {
        page: 1,
        pageSize: 100, // 获取较多数据以显示在地图上
        longitude: this.data.centerLocation.longitude,
        latitude: this.data.centerLocation.latitude
      })
      
      if (response.code === 200 && response.data) {
        this.setData({
          spots: response.data.list || []
        })
        
        // 添加景点标记
        if (this.data.mapService) {
          this.addSpotMarkers()
        }
      }
    } catch (error) {
      console.error('加载景点数据失败:', error)
      // 使用模拟数据
      this.setData({
        spots: this.getMockSpots()
      })
      
      // 添加景点标记
      if (this.data.mapService) {
        this.addSpotMarkers()
      }
    } finally {
      hideLoading()
    }
  },

  /**
   * 添加景点标记
   */
  async addSpotMarkers() {
    if (!this.data.mapService || this.data.spots.length === 0) return
    
    const markersData = []
    
    // 清空现有标记
    this.data.mapService.clearMarkers()
    
    // 准备标记数据
    for (const spot of this.data.spots) {
      const marker = {
        position: {
          longitude: spot.longitude,
          latitude: spot.latitude
        },
        options: {
          title: spot.name,
          iconPath: '/assets/icons/spot_marker.png',
          width: 40,
          height: 40,
          callout: {
            content: spot.name,
            color: '#ffffff',
            fontSize: 12,
            borderRadius: 4,
            bgColor: 'rgba(0, 0, 0, 0.7)',
            padding: 8,
            display: 'BYCLICK'
          },
          label: {
            content: spot.name.length > 5 ? spot.name.substring(0, 5) + '...' : spot.name,
            color: '#ffffff',
            fontSize: 10,
            bgColor: 'rgba(0, 0, 0, 0.6)',
            padding: 4,
            borderRadius: 2,
            position: 'bottom'
          }
        },
        spotData: spot
      }
      
      markersData.push(marker)
    }
    
    // 添加标记到地图
    const markerIds = await this.data.mapService.addMarkers(markersData)
    
    // 保存标记数据
    this.setData({
      markers: this.data.mapService.getMarkersData()
    })
  },

  /**
   * 地图点击事件处理
   */
  handleMapClick(e) {
    // 如果处于编辑模式，通过onMapTap处理添加控制点
    if (this.data.isEditMode) {
      this.onMapTap(e)
      return
    }
    
    // 关闭信息窗口
    this.setData({
      showInfoWindow: false,
      selectedSpot: null
    })
  },

  /**
   * 地图移动结束事件处理
   */
  handleMapMoveEnd(e) {
    // 可以在这里根据新的地图范围加载更多景点数据
    if (this.data.mapService) {
      this.data.mapService.getCenter().then(center => {
        this.setData({ centerLocation: center })
      })
    }
  },

  /**
   * 地图缩放结束事件处理
   */
  handleMapZoomEnd(e) {
    // 更新当前缩放级别
    this.setData({
      currentZoom: this.data.mapService ? this.data.mapService.getZoom() : 13
    })
  },

  /**
   * 标记点击事件处理
   */
  handleMarkerTap(e) {
    const markerId = e.markerId
    
    // 查找对应的景点数据
    const marker = this.data.markers.find(m => m.id === markerId)
    if (marker && marker.spotData) {
      this.setData({
        selectedSpot: marker.spotData,
        showInfoWindow: true
      })
    }
  },

  /**
   * 搜索景点
   */
  async handleSearch() {
    if (!this.data.searchKeyword.trim()) {
      showToast('请输入搜索关键词')
      return
    }
    
    try {
      showLoading('搜索中...')
      
      // 调用搜索API
      const response = await request('/spots/search', 'GET', {
        keyword: this.data.searchKeyword,
        longitude: this.data.centerLocation.longitude,
        latitude: this.data.centerLocation.latitude
      })
      
      if (response.code === 200 && response.data) {
        this.setData({
          spots: response.data.list || []
        })
        
        // 更新地图标记
        this.addSpotMarkers()
        
        // 如果有搜索结果，移动到第一个结果的位置
        if (this.data.spots.length > 0) {
          const firstSpot = this.data.spots[0]
          this.data.mapService.setCenter(firstSpot.longitude, firstSpot.latitude, 15)
        }
      }
    } catch (error) {
      console.error('搜索景点失败:', error)
      showToast('搜索失败，请重试')
    } finally {
      hideLoading()
    }
  },

  /**
   * 输入框内容变化
   */
  handleInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },

  /**
   * 跳转到景点详情页
   */
  navigateToSpotDetail() {
    if (!this.data.selectedSpot) return
    
    wx.navigateTo({
      url: `/pages/spotDetail/spotDetail?id=${this.data.selectedSpot.id}`
    })
  },

  /**
   * 查看路线
   */
  async viewRoute() {
    if (!this.data.selectedSpot || !this.data.userLocation) {
      showToast('无法获取位置信息')
      return
    }
    
    try {
      showLoading('规划路线中...')
      
      // 调用路线规划API
      const route = await this.data.mapService.planRoute(
        this.data.userLocation,
        {
          longitude: this.data.selectedSpot.longitude,
          latitude: this.data.selectedSpot.latitude
        },
        'driving'
      )
      
      // 绘制路线
      const path = route.path || [
        this.data.userLocation,
        {
          longitude: this.data.selectedSpot.longitude,
          latitude: this.data.selectedSpot.latitude
        }
      ]
      
      await this.data.mapService.drawRoute(path, {
        color: '#0091ff',
        width: 6,
        arrowLine: true
      })
      
      // 显示路线信息
      showToast(`距离约${Math.round(route.distance / 1000)}公里，预计${route.duration}分钟`)
      
    } catch (error) {
      console.error('路线规划失败:', error)
      showToast('路线规划失败，请重试')
    } finally {
      hideLoading()
    }
  },

  /**
   * 切换地图类型
   */
  switchMapType() {
    // 循环切换地图类型
    const mapTypes = ['gaode', 'baidu', 'tencent']
    const currentIndex = mapTypes.indexOf(this.data.mapType)
    const nextIndex = (currentIndex + 1) % mapTypes.length
    const newMapType = mapTypes[nextIndex]
    
    // 更新全局配置
    app.globalData.mapType = newMapType
    this.setData({ mapType: newMapType })
    
    // 重新初始化地图
    this.initMap()
  },

  /**
   * 定位到用户当前位置
   */
  locateUser() {
    if (this.data.userLocation) {
      this.data.mapService.setCenter(
        this.data.userLocation.longitude,
        this.data.userLocation.latitude,
        15
      )
    } else {
      this.getUserLocation().then(location => {
        if (location) {
          this.data.mapService.setCenter(location.longitude, location.latitude, 15)
        }
      })
    }
  },

  /**
   * 下拉刷新
   */
  async onPullDownRefresh() {
    this.setData({ refreshing: true })
    
    try {
      // 重新获取用户位置
      await this.getUserLocation()
      
      // 重新加载景点数据
      await this.loadSpots()
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      this.setData({ refreshing: false })
      wx.stopPullDownRefresh()
    }
  },

  /**
   * 获取模拟景点数据
   */
  getMockSpots() {
    return [
      {
        id: 1,
        name: '莱芜战役纪念馆',
        description: '全国重点文物保护单位，爱国主义教育基地',
        address: '山东省济南市莱芜区汶阳大街43号',
        longitude: 117.6779,
        latitude: 36.1623,
        rating: 4.8,
        coverImage: '/assets/images/spot1.jpg',
        ticketPrice: 0,
        openingHours: '08:00-17:00'
      },
      {
        id: 2,
        name: '雪野湖旅游区',
        description: '国家AAAA级旅游景区，山水景观优美',
        address: '山东省济南市莱芜区雪野镇',
        longitude: 117.5604,
        latitude: 36.3025,
        rating: 4.6,
        coverImage: '/assets/images/spot2.jpg',
        ticketPrice: 0,
        openingHours: '全天开放'
      },
      {
        id: 3,
        name: '房干生态旅游区',
        description: '山清水秀，生态环境优美',
        address: '山东省济南市莱芜区雪野镇房干村',
        longitude: 117.6093,
        latitude: 36.3147,
        rating: 4.5,
        coverImage: '/assets/images/spot3.jpg',
        ticketPrice: 80,
        openingHours: '07:30-17:30'
      },
      {
        id: 4,
        name: '莲花山风景区',
        description: '自然风光秀丽，历史文化底蕴深厚',
        address: '山东省济南市莱芜区高庄街道',
        longitude: 117.7632,
        latitude: 36.1158,
        rating: 4.7,
        coverImage: '/assets/images/spot4.jpg',
        ticketPrice: 50,
        openingHours: '07:00-18:00'
      }
    ]
  },

  /**
   * 添加地图控制点
   * @param {Object} position - 控制点位置
   * @param {Object} options - 控制点选项
   */
  addMCP(position, options = {}) {
    if (!this.data.mapService || !position) return null
    
    const controlPointId = this.data.mapService.addControlPoint(position, options)
    if (controlPointId) {
      // 更新控制点列表
      this.updateControlPointsList()
      
      // 保存到mcpData
      const newMCP = {
        id: controlPointId,
        position,
        options
      }
      const mcpData = [...this.data.mcpData, newMCP]
      this.setData({ mcpData })
      
      console.log('已添加控制点:', newMCP)
    }
    return controlPointId
  },

  /**
   * 更新控制点列表显示
   */
  updateControlPointsList() {
    if (!this.data.mapService) return
    
    const controlPoints = this.data.mapService.getControlPoints()
    this.setData({
      controlPoints
    })
  },

  /**
   * 切换控制点编辑模式
   */
  toggleEditMode() {
    if (!this.data.mapService) return
    
    const isEditMode = !this.data.isEditMode
    
    if (isEditMode) {
      this.data.mapService.activateControlPointEdit()
      wx.showToast({
        title: '已进入编辑模式',
        icon: 'success'
      })
    } else {
      this.data.mapService.deactivateControlPointEdit()
      wx.showToast({
        title: '已退出编辑模式',
        icon: 'success'
      })
    }
    
    this.setData({ isEditMode })
    // 更新控制点列表
    this.updateControlPointsList()
  },

  /**
   * 清除所有控制点
   */
  clearAllMCP() {
    if (!this.data.mapService) return
    
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有控制点吗？',
      success: (res) => {
        if (res.confirm) {
          this.data.mapService.clearControlPoints()
          this.setData({
            controlPoints: [],
            mcpData: []
          })
          wx.showToast({
            title: '已清除所有控制点',
            icon: 'success'
          })
        }
      }
    })
  },

  /**
   * 从地图点击添加控制点
   */
  onMapTap(e) {
    if (this.data.isEditMode) {
      const { longitude, latitude } = e.detail
      this.addMCP({ longitude, latitude })
    }
  }
})