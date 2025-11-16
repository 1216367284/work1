// spotList.js - 景点列表页面
const app = getApp()
import { request } from '../../utils/api'
import { showLoading, hideLoading, showToast, formatDistance, formatPrice } from '../../utils/util'

Page({
  data: {
    spots: [], // 景点列表数据
    filteredSpots: [], // 过滤后的景点列表
    loading: false, // 加载状态
    refreshing: false, // 下拉刷新状态
    hasMore: true, // 是否还有更多数据
    currentPage: 1, // 当前页码
    pageSize: 10, // 每页条数
    searchKeyword: '', // 搜索关键词
    filters: {
      minPrice: 0, // 最低价格
      maxPrice: 1000, // 最高价格
      minRating: 0, // 最低评分
      sortBy: 'recommended', // 排序方式: recommended, rating, distance, price_asc, price_desc
      category: '' // 景点类型
    },
    userLocation: null, // 用户位置
    categories: [
      { id: '', name: '全部' },
      { id: 'natural', name: '自然风光' },
      { id: 'cultural', name: '文化古迹' },
      { id: 'entertainment', name: '娱乐休闲' },
      { id: 'museum', name: '博物馆' },
      { id: 'park', name: '公园' }
    ],
    showFilterPanel: false, // 是否显示过滤面板
    selectedCategory: '', // 选中的分类
    sortOptions: [
      { id: 'recommended', name: '推荐排序' },
      { id: 'rating', name: '评分最高' },
      { id: 'distance', name: '距离最近' },
      { id: 'price_asc', name: '价格从低到高' },
      { id: 'price_desc', name: '价格从高到低' }
    ]
  },

  onLoad(options) {
    // 初始化页面
    this.initPage()
  },

  onShow() {
    // 页面显示时，如果有筛选条件变更，可以重新加载数据
  },

  /**
   * 初始化页面数据
   */
  async initPage() {
    try {
      this.setData({ loading: true })
      
      // 获取用户位置
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
          
          this.setData({ userLocation: location })
          resolve(location)
        },
        fail: (err) => {
          console.warn('获取位置失败:', err)
          resolve(null)
        }
      })
    })
  },

  /**
   * 加载景点数据
   * @param {boolean} append - 是否追加数据
   */
  async loadSpots(append = false) {
    try {
      if (!append) {
        showLoading('加载中...')
        this.setData({ currentPage: 1 })
      }
      
      // 构建请求参数
      const params = {
        page: this.data.currentPage,
        pageSize: this.data.pageSize,
        keyword: this.data.searchKeyword,
        minPrice: this.data.filters.minPrice,
        maxPrice: this.data.filters.maxPrice,
        minRating: this.data.filters.minRating,
        sortBy: this.data.filters.sortBy,
        category: this.data.filters.category
      }
      
      // 如果有用户位置，添加到请求参数中
      if (this.data.userLocation) {
        params.longitude = this.data.userLocation.longitude
        params.latitude = this.data.userLocation.latitude
      }
      
      // 调用API获取景点列表
      const response = await request('/spots', 'GET', params)
      
      if (response.code === 200 && response.data) {
        let spots = response.data.list || []
        
        // 计算距离（如果有用户位置）
        if (this.data.userLocation) {
          spots = spots.map(spot => {
            const distance = this.calculateDistance(
              this.data.userLocation,
              { longitude: spot.longitude, latitude: spot.latitude }
            )
            return {
              ...spot,
              distance
            }
          })
        }
        
        // 根据排序方式对数据进行排序（前端补充排序）
        spots = this.sortSpots(spots, this.data.filters.sortBy)
        
        // 更新数据
        if (append) {
          this.setData({
            spots: [...this.data.spots, ...spots],
            filteredSpots: [...this.data.filteredSpots, ...spots],
            hasMore: spots.length === this.data.pageSize,
            currentPage: this.data.currentPage + 1
          })
        } else {
          this.setData({
            spots,
            filteredSpots: spots,
            hasMore: spots.length === this.data.pageSize,
            currentPage: 2
          })
        }
      }
    } catch (error) {
      console.error('加载景点数据失败:', error)
      // 使用模拟数据
      let mockSpots = this.getMockSpots()
      
      // 计算距离（如果有用户位置）
      if (this.data.userLocation) {
        mockSpots = mockSpots.map(spot => {
          const distance = this.calculateDistance(
            this.data.userLocation,
            { longitude: spot.longitude, latitude: spot.latitude }
          )
          return {
            ...spot,
            distance
          }
        })
      }
      
      // 排序
      mockSpots = this.sortSpots(mockSpots, this.data.filters.sortBy)
      
      this.setData({ spots: mockSpots, filteredSpots: mockSpots })
    } finally {
      hideLoading()
      this.setData({ loading: false })
    }
  },

  /**
   * 计算两点之间的距离
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
  },

  /**
   * 根据条件排序景点
   */
  sortSpots(spots, sortBy) {
    const sorted = [...spots]
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'distance':
        return sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      case 'price_asc':
        return sorted.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0))
      case 'price_desc':
        return sorted.sort((a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0))
      case 'recommended':
      default:
        // 推荐排序（综合评分、距离、价格等）
        return sorted.sort((a, b) => {
          const scoreA = (a.rating * 0.5) + ((a.distance ? 1 / (a.distance / 10000) : 0) * 0.3) + ((a.ticketPrice === 0 ? 1 : 0) * 0.2)
          const scoreB = (b.rating * 0.5) + ((b.distance ? 1 / (b.distance / 10000) : 0) * 0.3) + ((b.ticketPrice === 0 ? 1 : 0) * 0.2)
          return scoreB - scoreA
        })
    }
  },

  /**
   * 搜索景点
   */
  async handleSearch() {
    this.setData({ filters: { ...this.data.filters, category: '' } })
    await this.loadSpots()
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
   * 清空搜索内容
   */
  clearSearch() {
    this.setData({ searchKeyword: '' })
    this.filterSpots()
  },

  /**
   * 切换筛选面板显示
   */
  toggleFilterPanel() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel
    })
  },

  /**
   * 选择分类
   */
  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: category,
      filters: { ...this.data.filters, category }
    })
    this.filterSpots()
  },

  /**
   * 选择排序方式
   */
  selectSort(e) {
    const sortBy = e.currentTarget.dataset.sort
    this.setData({
      filters: { ...this.data.filters, sortBy }
    })
    this.filterSpots()
  },

  /**
   * 应用筛选条件
   */
  applyFilters() {
    this.filterSpots()
    this.setData({ showFilterPanel: false })
  },

  /**
   * 重置筛选条件
   */
  resetFilters() {
    this.setData({
      filters: {
        minPrice: 0,
        maxPrice: 1000,
        minRating: 0,
        sortBy: 'recommended',
        category: ''
      },
      selectedCategory: '',
      searchKeyword: ''
    })
    this.filterSpots()
  },

  /**
   * 根据筛选条件过滤景点
   */
  filterSpots() {
    const { spots, filters, searchKeyword } = this.data
    
    let filtered = [...spots]
    
    // 根据关键词过滤
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(keyword) ||
        spot.description.toLowerCase().includes(keyword) ||
        spot.address.toLowerCase().includes(keyword)
      )
    }
    
    // 根据价格范围过滤
    filtered = filtered.filter(spot => 
      (spot.ticketPrice || 0) >= filters.minPrice && 
      (spot.ticketPrice || 0) <= filters.maxPrice
    )
    
    // 根据评分过滤
    filtered = filtered.filter(spot => 
      spot.rating >= filters.minRating
    )
    
    // 根据分类过滤
    if (filters.category) {
      filtered = filtered.filter(spot => 
        spot.category === filters.category
      )
    }
    
    // 根据排序方式排序
    filtered = this.sortSpots(filtered, filters.sortBy)
    
    this.setData({ filteredSpots: filtered })
  },

  /**
   * 跳转到景点详情页
   */
  navigateToSpotDetail(e) {
    const spotId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/spotDetail/spotDetail?id=${spotId}`
    })
  },

  /**
   * 跳转到景点地图页
   */
  navigateToSpotMap() {
    wx.navigateTo({
      url: '/pages/spotMap/spotMap'
    })
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
   * 上拉加载更多
   */
  async onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({ loading: true })
    await this.loadSpots(true)
  },

  /**
   * 获取模拟景点数据
   */
  getMockSpots() {
    return [
      {
        id: 1,
        name: '莱芜战役纪念馆',
        description: '全国重点文物保护单位，爱国主义教育基地，展示了莱芜战役的历史。',
        address: '山东省济南市莱芜区汶阳大街43号',
        longitude: 117.6779,
        latitude: 36.1623,
        rating: 4.8,
        coverImage: '/assets/images/spot1.jpg',
        ticketPrice: 0,
        openingHours: '08:00-17:00',
        category: 'cultural',
        reviewCount: 2356
      },
      {
        id: 2,
        name: '雪野湖旅游区',
        description: '国家AAAA级旅游景区，山水景观优美，是休闲度假的好去处。',
        address: '山东省济南市莱芜区雪野镇',
        longitude: 117.5604,
        latitude: 36.3025,
        rating: 4.6,
        coverImage: '/assets/images/spot2.jpg',
        ticketPrice: 0,
        openingHours: '全天开放',
        category: 'natural',
        reviewCount: 1892
      },
      {
        id: 3,
        name: '房干生态旅游区',
        description: '山清水秀，生态环境优美，有"山东小九寨"之称。',
        address: '山东省济南市莱芜区雪野镇房干村',
        longitude: 117.6093,
        latitude: 36.3147,
        rating: 4.5,
        coverImage: '/assets/images/spot3.jpg',
        ticketPrice: 80,
        openingHours: '07:30-17:30',
        category: 'natural',
        reviewCount: 1245
      },
      {
        id: 4,
        name: '莲花山风景区',
        description: '自然风光秀丽，历史文化底蕴深厚，是登山健身的好地方。',
        address: '山东省济南市莱芜区高庄街道',
        longitude: 117.7632,
        latitude: 36.1158,
        rating: 4.7,
        coverImage: '/assets/images/spot4.jpg',
        ticketPrice: 50,
        openingHours: '07:00-18:00',
        category: 'natural',
        reviewCount: 987
      },
      {
        id: 5,
        name: '莱芜博物馆',
        description: '展示莱芜地区的历史文化和文物藏品。',
        address: '山东省济南市莱芜区文化南路',
        longitude: 117.6721,
        latitude: 36.1615,
        rating: 4.3,
        coverImage: '/assets/images/spot5.jpg',
        ticketPrice: 0,
        openingHours: '09:00-16:00（周一闭馆）',
        category: 'museum',
        reviewCount: 634
      }
    ]
  }
})