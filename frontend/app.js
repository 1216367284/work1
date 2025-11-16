// app.js
App({
  onLaunch: function () {
    // 应用初始化时执行
    console.log('App Launch')
    
    // 初始化云开发环境（如果使用云开发）
    // wx.cloud.init({
    //   env: 'your-env-id',
    //   traceUser: true
    // })
    
    // 加载用户信息
    this.loadUserInfo()
  },
  
  onShow: function () {
    console.log('App Show')
  },
  
  onHide: function () {
    console.log('App Hide')
  },
  
  globalData: {
    userInfo: null,
    token: '',
    baseUrl: 'http://localhost:8080/api',
    mapType: 'gaode' // 默认高德地图
  },
  
  // 加载用户信息
  loadUserInfo: function() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    const mapType = wx.getStorageSync('mapType')
    
    if (token) {
      this.globalData.token = token
    }
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
    if (mapType) {
      this.globalData.mapType = mapType
    }
  },
  
  // 设置用户信息
  setUserInfo: function(userInfo, token) {
    this.globalData.userInfo = userInfo
    this.globalData.token = token
    
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('token', token)
  },
  
  // 设置地图类型
  setMapType: function(mapType) {
    this.globalData.mapType = mapType
    wx.setStorageSync('mapType', mapType)
  },
  
  // 清除登录信息
  clearLoginInfo: function() {
    this.globalData.userInfo = null
    this.globalData.token = ''
    
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
  }
})