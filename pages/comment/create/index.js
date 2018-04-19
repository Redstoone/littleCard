const app = getApp()

Page({
  data: {
    description: '',
    crid: null,
    cruid: null
  },

  onLoad: function (options) {
    this.setData({
      crid: options.crid,
      cruid: options.cruid
    })
  },

  bindTextAreaInput: function (e) {
    this.setData({
      description: e.detail.value
    })
  },

  bindCancel () {
    wx.navigateBack();
  },

  bindCardComment() {
    if (!this.data.description) {
      wx.showToast({
        title: '请输入评论',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }

    app.postRequest('/wx/cardRecordComment/merged', 'POST', {
      consumerId: app.globalData.openid,
      cardRecordId: this.data.crid,
      commentDescription: this.data.description,
      cardRecordUserId: this.data.cruid
    }, (res) => {
      if (res.data.success) {
        wx.showToast({
          title: '发表评论成功',
          icon: 'success',
          duration: 500,
          success: function (ret) {
            wx.navigateBack();
          }
        })
      }
    })
  }
})