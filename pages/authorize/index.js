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
        console.log(res)　　　　　　　 //do anything
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