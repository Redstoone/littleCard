const app = getApp();
Page({
  data: {
    zanList: [],
    userInfo: null,
    page: 1,
    size: 10,
    loading: false,
    loadingComplete: false
  },

  onLoad () {
    wx.showLoading({
      title: '加载中',
    })
    this.getZanList();
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  getZanList () {
    app.postRequest('/wx/cardRecordPraise/record', 'POST', { 
      consumerId: app.globalData.openid,
      page: this.data.page,
      size: this.data.size
    }, (res) => {
      let _zanList = res.data.rows

      _zanList = _zanList.map((item, index) => {
        let _item = item
        if (_item.cardRecord && _item.cardRecord.recordDescImg) {
          _item.recordImg = _item.cardRecord.recordDescImg.split(',')[0]
        }
        return _item
      })
      this.setData({
        zanList: _zanList
      })
      if (res.data.rows.length < this.data.size) {
        this.setData({
          loadingComplete: true,
        })
      }
      wx.hideLoading()
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
      this.getZanList()
    }
  },
})