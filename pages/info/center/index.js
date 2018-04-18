const app = getApp()
var utils = require("../../../utils/util")

Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  onLoad () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getCardRecord();
  }, 

  navtoSetting () {
    wx.navigateTo({
      url: '/pages/info/setting/index'
    })
  },

  // 下拉刷新
  onPullDownRefresh () {
    wx.showNavigationBarLoading();
    var that = this;
  },

  getCardRecord() {
    app.postRequest('/wx/cardRecord/record2', 'POST', {
      consumerId: app.globalData.openid
    }, (res) => {
      let _recommand = res.data.rows

      _recommand.map((item, index) => {
        let _item = item
        _item.timeFormat = utils.formatTimeText(item.recordDate)
        return _item
      })

      this.setData({
        recommand: _recommand
      })
    })
  },

  bindComment(e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../../comment/create/index?crid=' + _crid + '&cruid=' + _cruid
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