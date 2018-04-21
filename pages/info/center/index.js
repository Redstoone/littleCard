const app = getApp()
var utils = require("../../../utils/util")

Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    recommand: []
  },

  onLoad () {
    this.getUserInfo();
  },

  getUserInfo() {
    let _this = this
    let us = app.globalData.userInfo
    if (us) {
      _this.setData({
        userInfo: us
      })
      _this.getCardRecord()
    } else {
      app.getUserInfo(function (openid, userInfo) {
        if (openid) {
          _this.setData({
            userInfo: userInfo
          })
          _this.getCardRecord()
        }
      })
    }
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

  onShow() {
    app.postRequest('/wx/consumer/record', 'POST', {
      consumerId: app.globalData.openid
    }, (res) => {
      this.setData({
        userInfo: res.data.item
      })
    })
    this.getCardRecord()
  },

  getCardRecord() {
    app.postRequest('/wx/cardRecord/my', 'POST', {
      consumerId: app.globalData.openid
    }, (res) => {
      let _recommand = res.data.rows

      _recommand.map((item, index) => {
        let _item = item,
          _isZan = false
        _item.timeFormat = utils.formatTimeText(item.recordDate)
        _item.zanList = _item.cardRecordPraiseList.map((item2, idx2) => {
          if (item2.consumerId == app.globalData.openid) {
            _isZan = true
          }
          return {
            consumerId: item2.consumerId,
            nickname: item2.praiseConsumer.nickname
          }
        })
        _item.isZan = _isZan
        return _item
      })

      this.setData({
        recommand: _recommand
      })
    })
  },

  bindCommentDetail(e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../../comment/cardDiary/index?crid=' + _crid + '&cruid=' + _cruid
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
    let _idx = e.currentTarget.dataset.idx
    app.postRequest('/wx/cardRecordPraise/click', 'POST', {
      consumerId: app.globalData.openid,
      cardRecordId: _crid
    }, (res) => {
      if (res.data.success) {
        this.data.recommand[_idx].isZan = true
        this.data.recommand[_idx].zanList.push({
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