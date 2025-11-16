// spotDetail.js - 景点详情页面
const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    spotId: '',
    spot: {},
    reviews: [],
    activities: [],
    nearbySpots: [],
    images: [],
    currentImageIndex: 0,
    isFavorite: false,
    loading: true,
    reviewLoading: false,
    hasMoreReviews: true,
    reviewPage: 1,
    reviewLimit: 10,
    markers: [],
    mapCenter: null,
    currentTab: 'overview', // overview, reviews, nearby
    showMapModal: false,
    mapType: 'gaode' // 默认使用高德地图
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ spotId: options.id });
      this.loadSpotDetail();
    }
  },

  onShow() {
    // 检查是否已收藏
    if (this.data.spotId) {
      this.checkFavoriteStatus();
    }
  },

  // 加载景点详情
  loadSpotDetail() {
    this.setData({ loading: true });
    
    Promise.all([
      api.spots.getSpotDetail(this.data.spotId),
      api.reviews.getReviews(this.data.spotId, 1, this.data.reviewLimit),
      api.activities.getSpotActivities(this.data.spotId),
      api.spots.getNearbySpots(this.data.spotId, 10)
    ])
    .then(([spotRes, reviewsRes, activitiesRes, nearbyRes]) => {
      const spot = spotRes.data;
      const images = spot.images || [];
      
      // 准备地图标记点
      const markers = [];
      if (spot.latitude && spot.longitude) {
        markers.push({
          id: spot.id,
          latitude: spot.latitude,
          longitude: spot.longitude,
          title: spot.name,
          iconPath: '/assets/icons/spot_marker.png',
          width: 30,
          height: 30
        });
      }
      
      this.setData({
        spot,
        reviews: reviewsRes.data.items || [],
        activities: activitiesRes.data || [],
        nearbySpots: nearbyRes.data || [],
        images,
        markers,
        mapCenter: spot.latitude && spot.longitude ? {
          latitude: spot.latitude,
          longitude: spot.longitude
        } : null,
        hasMoreReviews: reviewsRes.data.total > this.data.reviewLimit,
        loading: false
      });
    })
    .catch(error => {
      console.error('Failed to load spot detail:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    });
  },

  // 检查收藏状态
  checkFavoriteStatus() {
    const userId = wx.getStorageSync('userId');
    if (!userId) return;
    
    api.favorites.checkFavorite(userId, this.data.spotId)
      .then(res => {
        this.setData({ isFavorite: res.data.isFavorite });
      })
      .catch(error => {
        console.error('Failed to check favorite status:', error);
      });
  },

  // 切换图片轮播
  onImageChange(e) {
    this.setData({ currentImageIndex: e.detail.current });
  },

  // 查看大图
  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    });
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  // 收藏/取消收藏
  toggleFavorite() {
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const apiMethod = this.data.isFavorite ? 
      api.favorites.removeFavorite : 
      api.favorites.addFavorite;

    apiMethod(userId, this.data.spotId)
      .then(() => {
        this.setData({ isFavorite: !this.data.isFavorite });
        wx.showToast({ 
          title: this.data.isFavorite ? '收藏成功' : '取消收藏', 
          icon: 'success' 
        });
      })
      .catch(error => {
        console.error('Failed to toggle favorite:', error);
        wx.showToast({ title: '操作失败', icon: 'none' });
      });
  },

  // 加载更多评论
  loadMoreReviews() {
    if (this.data.reviewLoading || !this.data.hasMoreReviews) return;
    
    this.setData({ reviewLoading: true });
    const nextPage = this.data.reviewPage + 1;
    
    api.reviews.getReviews(this.data.spotId, nextPage, this.data.reviewLimit)
      .then(res => {
        const newReviews = res.data.items || [];
        const totalReviews = this.data.reviews.concat(newReviews);
        
        this.setData({
          reviews: totalReviews,
          reviewPage: nextPage,
          hasMoreReviews: totalReviews.length < res.data.total,
          reviewLoading: false
        });
      })
      .catch(error => {
        console.error('Failed to load more reviews:', error);
        this.setData({ reviewLoading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  // 导航到地图
  navigateToMap() {
    if (!this.data.spot.latitude || !this.data.spot.longitude) {
      wx.showToast({ title: '暂无位置信息', icon: 'none' });
      return;
    }
    
    this.setData({ showMapModal: true });
  },

  // 关闭地图弹窗
  closeMapModal() {
    this.setData({ showMapModal: false });
  },

  // 打开外部地图导航
  openLocation() {
    const { spot } = this.data;
    wx.openLocation({
      latitude: Number(spot.latitude),
      longitude: Number(spot.longitude),
      name: spot.name,
      address: spot.address,
      scale: 18
    });
  },

  // 联系客服
  contactService() {
    wx.makePhoneCall({
      phoneNumber: this.data.spot.contactPhone || '400-123-4567',
      fail: () => {
        wx.showToast({ title: '拨打失败', icon: 'none' });
      }
    });
  },

  // 预约门票
  bookTicket() {
    if (this.data.spot.ticketPrice === undefined || this.data.spot.ticketPrice === null) {
      wx.showToast({ title: '暂不支持在线预约', icon: 'none' });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/booking/booking?spotId=${this.data.spotId}`
    });
  },

  // 导航到附近景点详情
  navigateToNearbySpot(e) {
    const spotId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/spotDetail/spotDetail?id=${spotId}`
    });
  },

  // 分享
  onShareAppMessage() {
    const { spot } = this.data;
    return {
      title: spot.name || '旅游景点详情',
      path: `/pages/spotDetail/spotDetail?id=${this.data.spotId}`,
      imageUrl: spot.coverImage || ''
    };
  },

  // 计算两点之间的距离
  calculateDistance(lat1, lon1, lat2, lon2) {
    return util.calculateDistance(lat1, lon1, lat2, lon2);
  },

  // 格式化日期
  formatDate(date) {
    return util.formatDate(date);
  }
});