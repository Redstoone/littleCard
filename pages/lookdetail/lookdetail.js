// pages/lookdetail/lookdetail.js
const app = getApp()
Page({

  data: {
    activityDetail: '',
    activityMember: '',
    cardClickNumber: '',
    activityDescImg: '',
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
})