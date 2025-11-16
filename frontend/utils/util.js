// util.js - 通用工具函数

/**
 * 格式化日期
 * @param {Date} date 日期对象
 * @param {String} format 格式化模板
 * @returns {String} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化价格
 * @param {Number} price 价格
 * @returns {String} 格式化后的价格字符串
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0.00'
  return parseFloat(price).toFixed(2)
}

/**
 * 格式化距离
 * @param {Number} meters 距离（米）
 * @returns {String} 格式化后的距离字符串
 */
export const formatDistance = (meters) => {
  if (!meters && meters !== 0) return '未知'
  
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  } else {
    return `${(meters / 1000).toFixed(1)}km`
  }
}

/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {Number} delay 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay = 300) => {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} func 要执行的函数
 * @param {Number} delay 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, delay = 300) => {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

/**
 * 计算两点之间的距离
 * @param {Number} lat1 第一个点的纬度
 * @param {Number} lon1 第一个点的经度
 * @param {Number} lat2 第二个点的纬度
 * @param {Number} lon2 第二个点的经度
 * @returns {Number} 距离（米）
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
 * 随机生成唯一ID
 * @returns {String} 唯一ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 显示加载提示
 * @param {String} title 提示文字
 */
export const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title: title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
export const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示成功提示
 * @param {String} title 提示文字
 * @param {Function} callback 回调函数
 */
export const showSuccess = (title = '操作成功', callback) => {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000,
    success: () => {
      if (callback) {
        setTimeout(callback, 2000)
      }
    }
  })
}

/**
 * 显示错误提示
 * @param {String} title 提示文字
 */
export const showError = (title = '操作失败') => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示确认对话框
 * @param {Object} options 选项
 * @returns {Promise} Promise对象
 */
export const showConfirm = (options = {}) => {
  const {
    title = '提示',
    content = '',
    confirmText = '确定',
    cancelText = '取消'
  } = options
  
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      cancelText: cancelText,
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          resolve(false)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取存储的数据
 * @param {String} key 存储键名
 * @returns {any} 存储的值
 */
export const getStorage = (key) => {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    console.error('获取存储失败:', e)
    return null
  }
}

/**
 * 设置存储数据
 * @param {String} key 存储键名
 * @param {any} value 存储的值
 * @returns {Boolean} 是否成功
 */
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('设置存储失败:', e)
    return false
  }
}

/**
 * 删除存储数据
 * @param {String} key 存储键名
 * @returns {Boolean} 是否成功
 */
export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('删除存储失败:', e)
    return false
  }
}

/**
 * 清空所有存储数据
 * @returns {Boolean} 是否成功
 */
export const clearStorage = () => {
  try {
    wx.clearStorageSync()
    return true
  } catch (e) {
    console.error('清空存储失败:', e)
    return false
  }
}

/**
 * 验证手机号
 * @param {String} phone 手机号
 * @returns {Boolean} 是否有效
 */
export const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 截断文本
 * @param {String} text 要截断的文本
 * @param {Number} maxLength 最大长度
 * @returns {String} 截断后的文本
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 获取当前位置
 * @returns {Promise} Promise对象
 */
export const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          altitude: res.altitude
        })
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 检查是否有位置权限
 * @returns {Promise<Boolean>} 是否有权限
 */
export const checkLocationPermission = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 请求位置权限
 * @returns {Promise<Boolean>} 是否授权成功
 */
export const requestLocationPermission = () => {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        resolve(true)
      },
      fail: (err) => {
        resolve(false)
      }
    })
  })
}