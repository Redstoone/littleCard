const app = getApp()
var utils = require("../../../utils/util")

Page({
  data: {
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    recommand: [],
    page: 1,
    size: 5,
    loading: false,
    loadingComplete: false,
    isPlay: false,
    videoSrc: null
  },

  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
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

  navtoSetting() {
    wx.navigateTo({
      url: '/pages/info/setting/index'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    var that = this;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    app.postRequest('/wx/consumer/record', 'POST', {
      consumerId: app.globalData.openid
    }, (res) => {
      this.setData({
        userInfo: res.data.item
      })
    })
    this.setData({
      page: 1,
      recommand: []
    })
    this.getCardRecord()
  },

  getCardRecord() {
    let that = this
    let _data = {
      page: that.data.page,
      size: that.data.size,
      consumerId: app.globalData.openid
    }
    app.postRequest('/wx/cardRecord/my', 'POST', _data, (res) => {
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
        _item.isZan = _isZan
        _item.imgList = _item.recordDescImg ? _item.recordDescImg.split(',') : [];
        if (_item.imgList.length) {
          _item.imgList = _item.imgList.map((imgUrl, index) => {
            if (imgUrl.indexOf('http://') < 0) {
              imgUrl = app.globalData.tmp_domain + '/' + imgUrl
            }
            return imgUrl
          });
        }
        return _item
      })

      that.setData({
        recommand: _recommand
      })

      if (res.data.rows.length < that.data.size) {
        that.setData({
          loadingComplete: true,
        })
      }

      wx.hideLoading()
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
      let _data = {
        page: that.data.page,
        size: that.data.size,
        consumerId: app.globalData.openid
      }
      app.postRequest('/wx/cardRecord/my', 'POST', _data, (res) => {
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
          _item.isZan = _isZan
          _item.imgList = _item.recordDescImg ? _item.recordDescImg.split(',') : [];
          if (_item.imgList.length) {
          _item.imgList = _item.imgList.map((imgUrl, index) => {
            if (imgUrl.indexOf('http://') < 0) {
              imgUrl = app.globalData.tmp_domain + '/' + imgUrl
            }
            return imgUrl
          });
        }
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
      })
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
  },

  videoClose() { 
    this.setData({
      isPlay: false
    })
    this.videoCtx.pause();
    this.videoCtx.seek(0);
    this.videoCtx.exitFullScreen();
  },

  onReady(e) {
    this.videoCtx = wx.createVideoContext('prewVideo')
  },

  // 显示视频
  showVideo(e) {
    let videoSrc = e.currentTarget.dataset.src;
    this.setData({
      isPlay: true,
      videoSrc: videoSrc
    })
    this.videoCtx.seek(0);
    this.videoCtx.play();
    this.videoCtx.requestFullScreen();
  },


  // 视屏全屏
  bindVideoScreenChange(e) {
    let status = e.detail.fullScreen;
    let _isPlay = false;
    if (status) {
      _isPlay = true
    } else {
      this.videoCtx.pause();
    }
    this.setData({
      isPlay: _isPlay
    });
  },

  videoImageOnLoad(ev) {
    var idx = ev.target.dataset.idx;
    this.data.recommand[idx].videoImg = {
      w: 480,
      h: ev.detail.height * 480 / ev.detail.width
    }
    this.setData({
      recommand: this.data.recommand
    })
  }
})