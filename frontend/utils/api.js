// api.js - 网络请求工具
const app = getApp()

// 基础请求函数
const request = (url, method, data = {}, needToken = true) => {
  return new Promise((resolve, reject) => {
    // 请求头
    const header = {
      'content-type': 'application/json'
    }
    
    // 如果需要token且存在token，则添加到请求头
    if (needToken && app.globalData.token) {
      header['Authorization'] = `Bearer ${app.globalData.token}`
    }
    
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        // 处理常见错误码
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // 未授权，清除登录信息，跳转到登录页
          app.clearLoginInfo()
          wx.redirectTo({
            url: '/pages/login/login'
          })
          reject(new Error('未授权，请重新登录'))
        } else {
          // 其他错误
          wx.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          })
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {
        // 请求完成后的操作
      }
    })
  })
}

// 封装GET请求
export const get = (url, data = {}, needToken = true) => {
  return request(url, 'GET', data, needToken)
}

// 封装POST请求
export const post = (url, data = {}, needToken = true) => {
  return request(url, 'POST', data, needToken)
}

// 封装PUT请求
export const put = (url, data = {}, needToken = true) => {
  return request(url, 'PUT', data, needToken)
}

// 封装DELETE请求
export const del = (url, data = {}, needToken = true) => {
  return request(url, 'DELETE', data, needToken)
}

// API接口定义
export default {
  // 用户相关接口
  user: {
    // 微信登录
    wechatLogin: (code, userInfo) => post('/user/login', { code, userInfo }, false),
    // 更新用户信息
    updateUserInfo: (userInfo) => put('/user/update', userInfo),
    // 更新地图偏好
    updateMapPreference: (mapType) => put('/user/map-preference', { mapType }),
    // 获取用户订单列表
    getUserOrders: (page, pageSize, status) => get('/user/orders', { page, pageSize, status }),
    // 获取用户评论列表
    getUserReviews: (page, pageSize) => get('/user/reviews', { page, pageSize })
  },
  
  // 景点相关接口
  scenicSpot: {
    // 获取景点列表（分页）
    getSpotList: (page, pageSize, keyword, tag) => get('/spots', { page, pageSize, keyword, tag }),
    // 获取热门景点
    getHotSpots: () => get('/spots/hot'),
    // 获取景点详情
    getSpotDetail: (id) => get(`/spots/${id}`),
    // 获取景点评论
    getSpotReviews: (id, page, pageSize) => get(`/spots/${id}/reviews`, { page, pageSize })
  },
  
  // 订单相关接口
  order: {
    // 创建订单
    createOrder: (orderData) => post('/orders', orderData),
    // 获取订单详情
    getOrderDetail: (id) => get(`/orders/${id}`),
    // 取消订单
    cancelOrder: (id) => put(`/orders/${id}/cancel`),
    // 支付订单
    payOrder: (id) => put(`/orders/${id}/pay`),
    // 完成订单
    completeOrder: (id) => put(`/orders/${id}/complete`),
    // 获取订单统计
    getOrderStatistics: () => get('/orders/statistics')
  },
  
  // 活动相关接口
  activity: {
    // 获取活动列表
    getActivityList: (page, pageSize) => get('/activities', { page, pageSize }),
    // 获取近期活动
    getRecentActivities: () => get('/activities/recent'),
    // 获取进行中活动
    getOngoingActivities: () => get('/activities/ongoing'),
    // 获取活动详情
    getActivityDetail: (id) => get(`/activities/${id}`),
    // 参加活动
    joinActivity: (id) => post(`/activities/${id}/join`)
  },
  
  // 评论相关接口
  review: {
    // 添加评论
    addReview: (reviewData) => post('/reviews', reviewData),
    // 点赞评论
    likeReview: (id) => put(`/reviews/${id}/like`),
    // 删除评论
    deleteReview: (id) => del(`/reviews/${id}`)
  },
  
  // 路线规划相关接口
  route: {
    // 获取推荐路线
    getRecommendedRoutes: () => get('/routes/recommended'),
    // 获取路线详情
    getRouteDetail: (id) => get(`/routes/${id}`),
    // 规划路线
    planRoute: (start, end, spots) => post('/routes/plan', { start, end, spots })
  },
  
  // 门票相关接口
  ticket: {
    // 获取门票列表
    getTicketList: (spotId) => get(`/spots/${spotId}/tickets`),
    // 获取门票详情
    getTicketDetail: (id) => get(`/tickets/${id}`)
  }
}