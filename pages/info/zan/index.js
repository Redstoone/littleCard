const app = getApp();
Page({
  data: {
    zanList: []
  },

  onLoad () {
    this.getZanList();
  },

  getZanList () {
    app.postRequest('/wx/cardRecordPraise/record', 'POST', { consumerId: app.globalData.openid }, (res) => {
      this.setData({
        zanList: res.data.rows
      })
    })
  }
})