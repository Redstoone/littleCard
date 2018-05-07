//index.js
var utils = require("../../utils/util")
const app = getApp()

Page({
  data: {
    userInfo: {},
    myCardList: [],
    recommand: [],
    page: 1,
    size: 5,
    loading: false,
    loadingComplete: false
  },
  // onShow: function () {
  //   this.setData({
  //     page: 1,
  //     recommand: []
  //   })
  //   this.getUserInfo()
  // },

  // 下拉刷新  
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      page: 1,
      recommand: []
    });
    that.getUserInfo()
  },
  onLoad() {
    this.getUserInfo()
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
        let cardList = res.data.item
        cardList = cardList.map((item, index) => {
          let _item = item;
          if (_item.timeType == 20) {
            _item.startDate = _item.startTime.substring(5, 10);
            _item.overDate = _item.overTime.substring(5, 10);
          }
          return _item
        })

        this.setData({
          myCardList: cardList
        })
      }
    })
  },

  getCardRecord() {
    let that = this
    let _data = {
      page: that.data.page,
      size: that.data.size,
      consumerId: app.globalData.openid
    }
    app.postRequest('/wx/cardRecord/record2', 'POST', _data, (res) => {
      let _recommand = res.data.rows
      _recommand.map((item, index) => {
        let _item = item,
          _isZan = false
        // _item.timeFormat = utils.formatTimeText(item.createTime)
        _item.timeFormat = item.createTime
        _item.zanList = _item.cardRecordPraiseList.map((item2, idx2) => {
          if (item2.consumerId == app.globalData.openid) {
            _isZan = true
          }
          return {
            consumerId: item2.consumerId,
            nickname: item2.praiseConsumer.nickname
          }
        })
        _item.isZan = _isZan;
        _item.imgList = _item.recordDescImg ? _item.recordDescImg.split(',') : [];
        return _item
      })

      that.setData({
        recommand: that.data.recommand.concat(_recommand),
        loading: false
      })

      if (res.data.rows.length < this.data.size) {
        that.setData({
          loadingComplete: true,
        })
      }

      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (!that.data.loadingComplete) {
      that.setData({
        page: that.data.page + 1,
        loading: true
      });
      this.getCardRecord()
    }
  },


  // 图片预览
  previewImage(e) {
    var current = e.target.dataset.src;
    var idx = e.target.dataset.idx;
    wx.previewImage({
      current: current,
      urls: this.data.recommand[idx].imgList
    })
  }
})