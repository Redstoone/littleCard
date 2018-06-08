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
    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      acId: options.acId
    })
    this.getUserInfo();
  },

  getUserInfo() {
    let _this = this
    let us = app.globalData.userInfo
    if (us) {
      _this.setData({
        userInfo: us
      })
      _this.getHasJon(_this.data.acId)
      _this.getSingleAll(_this.data.acId)
    } else {
      app.getUserInfo(function (openid, userInfo) {
        if (openid) {
          _this.setData({
            userInfo: userInfo
          })
          _this.getHasJon(_this.data.acId)
          _this.getSingleAll(_this.data.acId)
        }
      })
    }
  },

  onShow() {
    this.getUserInfo();
    this.getHasJon(this.data.acId)
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
        let imgs = []
        if (activity.activityDetail.activityDescImg) {
          imgs = activity.activityDetail.activityDescImg.split(',');
          imgs = imgs.map((item, index) => {
            return {
              id: index,
              url: item,
              width: 0,
              height: 0
            }
          });
        }
        that.setData({
          activity: activity,
          activityDetail: res.data.item.activityDetail,
          activityMember: res.data.item.activityMember.slice(0, 3),
          cardClickNumber: res.data.item.cardClickNumber,
          activityDescImg: imgs,
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

        wx.hideLoading();
      }
    })
  },

  getHasJon(acId) {
    let that = this
    app.postRequest('/wx/activity/member/hasJoin', 'POST', {
      activityId: acId,
      consumerId: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        // wx.redirectTo({
        //   url: '../activity/activity?acId=' + this.data.acId,
        // })
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
    wx.redirectTo({
      url: '../activity/activity?acId=' + this.data.acId,
    })
  },

  imageLoad(e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = 710; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.activityDescImg;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id == imageId) {
        images[i].width = '100%';
        images[i].height = imgHeight;
        break;
      }
    }
    this.setData({
      activityDescImg: images
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