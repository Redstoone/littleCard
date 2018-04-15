const app = getApp();
Page({
  data: {
    recommand: []
  },

  onLoad() {
    this.getCommandList()
  },

  getCommandList () {
    app.postRequest('/wx/cardRecordComment/record', 'POST', { consumerId: app.globalData.openid }, (res) => {
      this.setData({
        recommand: res.data.rows
      })
    })
  }
})