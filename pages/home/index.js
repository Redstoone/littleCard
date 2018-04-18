//index.js
var utils = require("../../utils/util")
const app = getApp()

Page({
  data: {
    userInfo: {},
    myCardList: [],
    recommand: []
  },
  onShow: function () {
    this.getUserInfo()
    // this.getActivity()
    // this.getCardRecord()
  },

  getUserInfo() {
    let _this = this
    let us = wx.getStorageSync('userInfo')
    if (us) {
      _this.setData({
        userInfo: JSON.parse(us)
      })
    } else {
      app.getUserInfo(function (openid, userInfo) {
        if (openid) {
          _this.setData({
            userInfo: userInfo
          })
          _this.getActivity()
          _this.getCardRecord()
        }
      })
    }
  },

  getActivity() {
    app.postRequest('/wx/activity/activity', 'POST', {
      consumerId: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        let _myCardList = res.data.item

        _myCardList.map((item, index) => {
          let _item = item
          app.postRequest('/wx/cardRecord/hasCard', 'POST', {
            consumerId: item.consumerId
          }, (ret) => {
            _item.hasCard = ret.data.hasCardRecord
          })
        })

        this.setData({
          myCardList: res.data.item
        })
      }
    })
  },

  getCardRecord() {
    app.postRequest('/wx/cardRecord/record2', 'POST', {
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

  addCard() {
    wx.navigateTo({
      url: '../newCard/newCard',
    })
  },

  bindViewCard(e) {
    wx.navigateTo({
      url: '../activity/activity?acId=' + e.currentTarget.dataset.id,
    })
  },

  bindCommentDetail(e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../comment/cardDiary/index?crid=' + _crid + '&cruid=' + _cruid
    })
  },

  bindComment(e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../comment/create/index?crid=' + _crid + '&cruid=' + _cruid
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