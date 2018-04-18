var utils = require("../../../utils/util")
const app = getApp()

Page({
  data: {
    recommand: null,
    user: null,
    crid: null,
    cruid: null
  },

  onLoad(options) {
    this.setData({
      crid: options.crid,
      cruid: options.cruid
    })
    this.getCommandList(options.crid, options.cruid)
  },

  onShow() {
    this.getCommandList(this.data.crid, this.data.cruid)
  },

  getCommandList(crid, cruid) {
    app.postRequest('/wx/cardRecord/detail', 'POST', {
      consumerId: cruid,
      cardRecordId: crid
    }, (res) => {
      let _recommand = res.data.item
      _recommand.timeFormat = utils.formatTimeText(_recommand.createTime)
      this.setData({
        recommand: _recommand,
        user: app.globalData.userInfo
      })
    })
  },

  bindComment(e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../../create/index?crid=' + _crid + '&cruid=' + _cruid
    })
  },

  bindZan(e) {
    let _crid = e.currentTarget.dataset.crid
    app.postRequest('/wx/cardRecordPraise/click', 'POST', {
      consumerId: 'o3S065KtkR7Kp4Kr0jsSDE11bniI',
      cardRecordId: _crid
    }, (res) => {
      console.log(res)
    })
  }
})