// pages/lookdetail/lookdetail.js
const app = getApp()
Page({

  data: {
    activity: '',
    activityDetail: '',
    activityMember: '',
    cardClickNumber: '',
    activityDescImg: '',
    activityDescImgData: '',
    activityDescVideo: '',
    activityDescVideoData: '',
    name: '',
    acId: '',
    isPlay: false,
    videoCtx: null,
    hasJoin: false
  },

  onLoad: function (options) {
    this.setData({
      acId: options.acId
    })
    this.getSingleAll(options.acId);
  },

  onShow() {
    this.getSingleAll(this.data.acId);
  },

  getSingleAll (acid) {
    let that = this
    app.postRequest('/wx/activity/singleAll', 'POST', {
      id: acid
    }, (res) => {
      if (res.data.success) {
        let activity = res.data.item;
        if (activity.timeType == 20) {
          activity.startDate = activity.startTime.substring(0, 10);
          activity.overDate = activity.overTime.substring(0, 10);
        }
        that.setData({
          activity: activity,
          activityDetail: res.data.item.activityDetail,
          activityMember: res.data.item.activityMember.slice(0, 3),
          cardClickNumber: res.data.item.cardClickNumber,
          activityDescImg: res.data.item.activityDetail.activityDescImg ? res.data.item.activityDetail.activityDescImg.split(',') : [],
          activityDescVideo: res.data.item.activityDetail.activityDescVideo,
          memberNumber: res.data.item.memberNumber,
          name: res.data.item.name,
          isStrat: activity.timeType == 20 && new Date(activity.startTime) < new Date() ? true : false,
          isOver: activity.timeType == 20 && new Date(activity.overTime) < new Date() ? true : false
        })
        app.postRequest('/wx/consumer/record', 'POST', {
          consumerId: res.data.item.consumerId
        }, (ret) => {
          if (ret.data.success) {
            that.setData({
              user: ret.data.item
            })
          }
        })
      }
    })
    this.getHasJon(acid)
  },

  getHasJon(acId) {
    let that = this
    app.postRequest('/wx/activity/member/hasJoin', 'POST', {
      activityId: acId,
      consumerId: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        this.setData({
          hasJoin: true
        })
      } else {
        this.setData({
          hasJoin: false
        })
      }
    })
  },

  bindJoinActivity() {
    let that = this
    app.postRequest('/wx/activity/member/join', 'POST', {
      activityId: that.data.acId,
      consumerId: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          duration: 1500,
          success: function () {
            wx.navigateTo({
              url: '../activity/activity?acId=' + that.data.acId,
            })
          }
        })
      } else {
        wx.showToast({
          title: '活动未开始',
          icon: 'loading',
          duration: 1500
        })
      }
    });
  },

  bindGotoActivity() {
    wx.navigateTo({
      url: '../activity/activity?acId=' + this.data.acId,
    })
  },

  imageLoad(e) {
    let $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; //图片的真实宽高比例
    let viewWidth = 690, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 690 / ratio; //计算的高度值
    this.setData({
      activityDescImgData: {
        width: viewWidth,
        height: viewHeight
      }
    })
  },

  onReady(e) {
    this.videoCtx = wx.createVideoContext('myVideo')
  },
  showVideo() {
    this.setData({
      isPlay: true
    })
    this.videoCtx.play()
  },
})