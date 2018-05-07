let utils = require("../../../utils/util")
const app = getApp()

Page({
  data: {
    recommand: null,
    user: null,
    crid: null,
    cruid: null,
    camvd: null,
    isPlay: false,
    imgWidth: 0,
    imgHeight: 0
  },

  onLoad(options) {
    this.setData({
      crid: options.crid,
      cruid: options.cruid
    })
    this.getCommandList(options.crid, options.cruid)
    this.getUser(options.cruid)
  },

  // onShow() {
  //   this.getCommandList(this.data.crid, this.data.cruid)
  //   this.getUser(this.data.cruid)
  // },

  getCommandList(crid, cruid) {
    app.postRequest('/wx/cardRecord/detail', 'POST', {
      consumerId: cruid,
      cardRecordId: crid
    }, (res) => {
      let _recommand = res.data.item,
        _isZan = false

      // _recommand.timeFormat = utils.formatTimeText(_recommand.createTime)
      _recommand.timeFormat = _recommand.createTime
      _recommand.zanList = _recommand.cardRecordPraiseList.map((item2, idx2) => {
        if (item2.consumerId == app.globalData.openid) {
          _isZan = true
        }
        return {
          consumerId: item2.consumerId,
          nickname: item2.praiseConsumer.nickname
        }
      })
      _recommand.cardWeight.recordWeight = Number(_recommand.cardWeight.recordWeight);
      _recommand.cardWeight.recordWaist = Number(_recommand.cardWeight.recordWaist);
      _recommand.cardWeight.recordFat = Number(_recommand.cardWeight.recordFat);
      _recommand.isZan = _isZan
      _recommand.imgList = _recommand.recordDescImg ? _recommand.recordDescImg.split(',') : []

      this.setData({
        recommand: _recommand,
      })
    })
  },

  getUser(crid) {
    app.postRequest('/wx/consumer/record', 'POST', {
      consumerId: crid
    }, (res) => {
      this.setData({
        user: res.data.item
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
  },

  previewImage(e) {
    let current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.recommand.imgList
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
  showVideo(e) {
    let videoSrc = e.currentTarget.dataset.src;
    this.setData({
      isPlay: true,
      camvd: videoSrc
    })
    this.videoCtx.seek(0);
    this.videoCtx.play();
    this.videoCtx.requestFullScreen();
  },

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

  imageOnLoad(ev) {
    this.setData({
      imgWidth: ev.detail.width/2,
      imgHeight: ev.detail.height/2
    })
  }
})