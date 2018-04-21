// pages/lookdetail/lookdetail.js
const app = getApp()
Page({

  data: {
    activityDetail: '',
    activityMember: '',
    cardClickNumber: '',
    activityDescImg: '',
    activityDescImgData: '',
    activityDescVideo: '',
    activityDescVideoData: '',
    name: '',
    acId: '',
  },

  onLoad: function (options) {
    var that = this
    app.postRequest('/wx/activity/singleAll', 'POST', {
      id: options.acId
    }, (res) => {
      if (res.data.success) {
        that.setData({
          activityDetail: res.data.item.activityDetail,
          activityMember: res.data.item.activityMember.slice(0, 3),
          cardClickNumber: res.data.item.cardClickNumber,
          activityDescImg: res.data.item.activityDetail.activityDescImg ? res.data.item.activityDetail.activityDescImg.split(',') : [],
          activityDescVideo: res.data.item.activityDetail.activityDescVideo,
          memberNumber: res.data.item.memberNumber,
          name: res.data.item.name,
          acId: options.acId
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

  imageLoad (e) {
    let $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; //图片的真实宽高比例
    let viewWidth = 690, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 690 / ratio; //计算的高度值
    let image = this.data.activityDescImg;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      activityDescImgData: image
    })
  },
})