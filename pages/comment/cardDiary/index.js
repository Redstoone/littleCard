var utils = require("../../../utils/util")
const app = getApp()

Page({
  data: {
    recommand: [],
    user: null
  },

  onShow() {
    this.getCommandList()
  },

  getCommandList() {
    // app.postRequest('/wx/cardRecordComment/record', 'POST', { consumerId: app.globalData.openid }, (res) => {
    app.postRequest('/wx/cardRecordComment/record', 'POST', { consumerId: 'o3S065KtkR7Kp4Kr0jsSDE11bniI' }, (res) => {
      let _recommand = res.data.item

      _recommand.map((item, index) => {
        let _item = item
        _item.timeFormat = utils.formatTimeText(item.createTime)
        return _item
      })

      this.setData({
        recommand: _recommand,
        user: res.data.user
      })
    })
  },

  bindComment (e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../create/index?crid=' + _crid + '&cruid=' + _cruid
    })
  },

  bindZan (e) {
    let _crid = e.currentTarget.dataset.crid
    app.postRequest('/wx/cardRecordPraise/click', 'POST', {
      consumerId: 'o3S065KtkR7Kp4Kr0jsSDE11bniI',
      cardRecordId: _crid
    }, (res) => {
      console.log(res)
    })
  }
})