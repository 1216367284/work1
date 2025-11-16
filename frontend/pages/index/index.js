// index.js - 首页
import api from '../../utils/api'
import util from '../../utils/util'

Page({
  data: {
    // 轮播图数据
    bannerList: [],
    // 热门景点数据
    hotSpots: [],
    // 近期活动数据
    recentActivities: [],
    // 推荐路线数据
    recommendedRoutes: [],
    // 是否正在加载
    loading: true,
    // 当前位置信息
    currentLocation: null,
    // 是否获取了位置权限
    hasLocationPermission: false
  },

  onLoad: function () {
    // 页面加载时执行
    this.initPage()
  },

  onShow: function () {
    // 页面显示时执行
    const app = getApp()
    // 如果用户信息或地图类型发生变化，可以在这里处理
  },

  /**
   * 初始化页面数据
   */
  initPage: async function () {
    try {
      this.setData({ loading: true })
      
      // 检查并获取位置权限
      await this.handleLocationPermission()
      
      // 并行加载所有数据
      const [hotSpotsData, activitiesData] = await Promise.all([
        api.scenicSpot.getHotSpots(),
        api.activity.getRecentActivities()
      ])
      
      // 设置轮播图数据（这里使用热门景点作为示例）
      const bannerList = hotSpotsData.slice(0, 3).map(spot => ({
        id: spot.id,
        image: spot.imageUrl,
        title: spot.name
      }))
      
      this.setData({
        bannerList: bannerList,
        hotSpots: hotSpotsData,
        recentActivities: activitiesData,
        loading: false
      })
    } catch (error) {
      console.error('初始化页面失败:', error)
      util.showError('加载数据失败')
      this.setData({ loading: false })
    }
  },

  /**
   * 处理位置权限
   */
  handleLocationPermission: async function () {
    try {
      // 检查是否有位置权限
      const hasPermission = await util.checkLocationPermission()
      
      if (hasPermission) {
        // 如果有权限，获取当前位置
        const location = await util.getLocation()
        this.setData({
          currentLocation: location,
          hasLocationPermission: true
        })
      } else {
        // 如果没有权限，请求权限
        const granted = await util.requestLocationPermission()
        if (granted) {
          // 如果用户授权，获取当前位置
          const location = await util.getLocation()
          this.setData({
            currentLocation: location,
            hasLocationPermission: true
          })
        } else {
          this.setData({ hasLocationPermission: false })
        }
      }
    } catch (error) {
      console.error('获取位置失败:', error)
      this.setData({ hasLocationPermission: false })
    }
  },

  /**
   * 跳转到搜索页面
   */
  goToSearch: function () {
    wx.navigateTo({
      url: '/pages/spotList/spotList?showSearch=true'
    })
  },

  /**
   * 跳转到景点列表页面
   */
  goToSpotList: function () {
    wx.navigateTo({
      url: '/pages/spotList/spotList'
    })
  },

  /**
   * 跳转到景点详情页面
   */
  goToSpotDetail: function (e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/spotDetail/spotDetail?id=${id}`
    })
  },

  /**
   * 跳转到地图页面
   */
  goToMap: function () {
    wx.switchTab({
      url: '/pages/map/map'
    })
  },

  /**
   * 跳转到活动列表页面
   */
  goToActivityList: function () {
    wx.navigateTo({
      url: '/pages/activityList/activityList'
    })
  },

  /**
   * 跳转到活动详情页面
   */
  goToActivityDetail: function (e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/activityDetail/activityDetail?id=${id}`
    })
  },

  /**
   * 跳转到路线规划页面
   */
  goToRoute: function () {
    wx.navigateTo({
      url: '/pages/route/route'
    })
  },

  /**
   * 轮播图点击事件
   */
  onBannerClick: function (e) {
    const { id } = e.currentTarget.dataset
    this.goToSpotDetail({ currentTarget: { dataset: { id } } })
  },

  /**
   * 刷新页面数据
   */
  onPullDownRefresh: function () {
    this.initPage().finally(() => {
      wx.stopPullDownRefresh()
    })
  }
})