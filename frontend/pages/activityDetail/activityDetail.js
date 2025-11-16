// activityDetail.js - 活动详情页面
const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    activityId: '',
    activity: {},
    participants: [],
    reviews: [],
    images: [],
    currentImageIndex: 0,
    isJoined: false,
    loading: true,
    reviewLoading: false,
    hasMoreReviews: true,
    reviewPage: 1,
    reviewLimit: 10,
    markers: [],
    mapCenter: null,
    currentTab: 'overview', // overview, reviews, participants
    showMapModal: false,
    countdown: null,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    timer: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ activityId: options.id });
      this.loadActivityDetail();
    }
  },

  onShow() {
    // 检查是否已参加活动
    if (this.data.activityId) {
      this.checkJoinStatus();
    }
  },

  onHide() {
    // 清除倒计时定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  onUnload() {
    // 清除倒计时定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // 加载活动详情
  loadActivityDetail() {
    this.setData({ loading: true });
    
    Promise.all([
      api.activities.getActivityDetail(this.data.activityId),
      api.activities.getActivityParticipants(this.data.activityId),
      api.reviews.getActivityReviews(this.data.activityId, 1, this.data.reviewLimit)
    ])
    .then(([activityRes, participantsRes, reviewsRes]) => {
      const activity = activityRes.data;
      const images = activity.images || [];
      
      // 准备地图标记点
      const markers = [];
      if (activity.latitude && activity.longitude) {
        markers.push({
          id: activity.id,
          latitude: activity.latitude,
          longitude: activity.longitude,
          title: activity.name,
          iconPath: '/assets/icons/activity_marker.png',
          width: 30,
          height: 30
        });
      }
      
      this.setData({
        activity,
        participants: participantsRes.data || [],
        reviews: reviewsRes.data.items || [],
        images,
        markers,
        mapCenter: activity.latitude && activity.longitude ? {
          latitude: activity.latitude,
          longitude: activity.longitude
        } : null,
        hasMoreReviews: reviewsRes.data.total > this.data.reviewLimit,
        loading: false
      });
      
      // 开始倒计时
      this.startCountdown(activity.endTime);
    })
    .catch(error => {
      console.error('Failed to load activity detail:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    });
  },

  // 检查参加状态
  checkJoinStatus() {
    const userId = wx.getStorageSync('userId');
    if (!userId) return;
    
    api.activities.checkJoinStatus(userId, this.data.activityId)
      .then(res => {
        this.setData({ isJoined: res.data.isJoined });
      })
      .catch(error => {
        console.error('Failed to check join status:', error);
      });
  },

  // 开始倒计时
  startCountdown(endTime) {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = new Date(endTime).getTime();
      const difference = eventTime - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        this.setData({
          days,
          hours,
          minutes,
          seconds
        });
      } else {
        // 活动已结束
        this.setData({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (this.data.timer) {
          clearInterval(this.data.timer);
          this.setData({ timer: null });
        }
      }
    };
    
    // 立即计算一次
    calculateTimeLeft();
    
    // 设置定时器
    const timer = setInterval(calculateTimeLeft, 1000);
    this.setData({ timer });
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

  // 参加/取消参加活动
  toggleJoin() {
    const userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const apiMethod = this.data.isJoined ? 
      api.activities.cancelJoin : 
      api.activities.joinActivity;

    apiMethod(userId, this.data.activityId)
      .then(() => {
        this.setData({ isJoined: !this.data.isJoined });
        wx.showToast({ 
          title: this.data.isJoined ? '参加成功' : '已取消', 
          icon: 'success' 
        });
        
        // 刷新参与者列表
        this.loadParticipants();
      })
      .catch(error => {
        console.error('Failed to toggle join:', error);
        wx.showToast({ title: '操作失败', icon: 'none' });
      });
  },

  // 加载参与者列表
  loadParticipants() {
    api.activities.getActivityParticipants(this.data.activityId)
      .then(res => {
        this.setData({ participants: res.data || [] });
      })
      .catch(error => {
        console.error('Failed to load participants:', error);
      });
  },

  // 加载更多评论
  loadMoreReviews() {
    if (this.data.reviewLoading || !this.data.hasMoreReviews) return;
    
    this.setData({ reviewLoading: true });
    const nextPage = this.data.reviewPage + 1;
    
    api.reviews.getActivityReviews(this.data.activityId, nextPage, this.data.reviewLimit)
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
    if (!this.data.activity.latitude || !this.data.activity.longitude) {
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
    const { activity } = this.data;
    wx.openLocation({
      latitude: Number(activity.latitude),
      longitude: Number(activity.longitude),
      name: activity.name,
      address: activity.location,
      scale: 18
    });
  },

  // 联系客服
  contactService() {
    wx.makePhoneCall({
      phoneNumber: this.data.activity.contactPhone || '400-123-4567',
      fail: () => {
        wx.showToast({ title: '拨打失败', icon: 'none' });
      }
    });
  },

  // 分享
  onShareAppMessage() {
    const { activity } = this.data;
    return {
      title: activity.name || '旅游活动详情',
      path: `/pages/activityDetail/activityDetail?id=${this.data.activityId}`,
      imageUrl: activity.image || ''
    };
  },

  // 格式化日期
  formatDate(date) {
    return util.formatDate(date);
  }
});