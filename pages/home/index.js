//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    myCardList: [],
    recommand: []
  },
  onLoad: function () {
    this.getUserInfo()
    // this.getActivity()
    this.getCardRecord()
  },

  getUserInfo() {
    let _this = this
    let us = wx.getStorageSync('userInfo')
    if (us) {
      _this.setData({
        userInfo: JSON.parse(us)
      })

      _this.getActivity()
    } else {
      app.getUserInfo(function (userInfo) {
        if (userInfo) {
          _this.setData({
            userInfo: userInfo
          })

          _this.getActivity()
        }
      })
    }
  },

  getActivity() {
    // app.postRequest('/wx/activity/activity', 'POST', { consumerId: app.globalData.openid }, (res) => {
    app.postRequest('/wx/activity/activity', 'POST', {
      consumerId: 'o3S065KtkR7Kp4Kr0jsSDE11bniI'
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
      // consumerId: app.globalData.openid
      consumerId: 'o3S065KtkR7Kp4Kr0jsSDE11bniI'
    }, (res) => {
      console.log(res)
      let _recommand = res.data.rows

      _recommand.map((item, index) => {
        let _item = item
        app.postRequest('/wx/consumer/record', 'POST', {
          consumerId: item.consumerId
        }, (ret) => {
          _item.user = ret.data.item
        })
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
  }
})