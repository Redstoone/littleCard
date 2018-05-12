var utils = require("../../../utils/util");
const app = getApp();
Page({
  data: {
    recommand: [],
    user: null
  },

  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    this.getCommandList()
  },

  getCommandList () {
    app.postRequest('/wx/cardRecordComment/record', 'POST', { consumerId: app.globalData.openid }, (res) => {
      let _recommand = res.data.item

      _recommand.map((item, index) => {
        let _item = item
        // _item.timeFormat = utils.formatTimeText(item.createTime)
        _item.timeFormat = item.createTime
        return _item
      })

      this.setData({
        recommand: _recommand,
        user: res.data.user
      })

      wx.hideLoading()
    })
  }
})