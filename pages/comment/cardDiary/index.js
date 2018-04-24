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
      let _recommand = res.data.item,
          _isZan = false

      _recommand.timeFormat = utils.formatTimeText(_recommand.createTime)
      _recommand.zanList = _recommand.cardRecordPraiseList.map((item2, idx2) => {
        if (item2.consumerId == app.globalData.openid) {
          _isZan = true
        }
        return {
          consumerId: item2.consumerId,
          nickname: item2.praiseConsumer.nickname
        }
      })
      _recommand.isZan = _isZan
      _recommand.imgList = _recommand.recordDescImg ? _recommand.recordDescImg.split(',') : []

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
      url: '../create/index?crid=' + _crid + '&cruid=' + _cruid
    })
  },

  bindZan(e) {
    let _crid = e.currentTarget.dataset.crid
    app.postRequest('/wx/cardRecordPraise/click', 'POST', {
      consumerId: app.globalData.openid,
      cardRecordId: _crid
    }, (res) => {
      if (res.data.success) {
        this.data.recommand.isZan = true
        this.data.recommand.zanList.push({
          consumerId: app.globalData.openid,
          nickname: app.globalData.userInfo.nickname
        })

        this.setData({
          recommand: this.data.recommand
        })
      }
    })
  }
})