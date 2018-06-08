Page({
  data: {
    btnShow: true
  },

  onLoad: function () {

  },

  onShow: function (options) {
    this.onGotUserInfo()
  },

  onGotUserInfo: function () {
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
      },
      fail: that.showPrePage
    })
  },

  showPrePage: function () {
    this.setData({
      eye: false
    })
  }
})