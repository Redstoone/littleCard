//index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    myCardList: [],
    recommand: [
      {
        id: 1,
        pic: '/images/index/card_pic.png',
        nick_name: '心潜',
        time: '1分钟前',
        days: '22',
        remark: '坚持锻炼身体',
        item_pic: '/images/index/card_pic.png',
        card_pic: '/images/index/card_pic.png',
        card_title: '户外锻炼',
        card_num: 7650
      }, {
        id: 2,
        pic: '/images/index/card_pic.png',
        nick_name: '历史',
        time: '5分钟前',
        days: '100',
        remark: '坚持锻炼身体',
        item_pic: '/images/index/card_pic.png',
        card_pic: '/images/index/card_pic.png',
        card_title: '户外锻炼',
        card_num: 7650
      }
    ]
  },
  onLoad: function () {
    this.getUserInfo()
    // this.getActivity()
  },

  getUserInfo () {
    let _this = this
    let us = wx.getStorageSync('userInfo')
    if (us) {
      _this.setData({
        userInfo: JSON.parse(us)
      })
      if (app.globalData.openid == null || app.globalData.openid == ''){
        app.watch = _this.getActivity
      }else{
        _this.getActivity()
      }
      
    } else {
      app.getUserInfo(function (userInfo) {
        if (userInfo) {
          _this.setData({
            userInfo: userInfo
          })
          if (app.globalData.openid == null || app.globalData.openid == '') {
            app.watch = _this.getActivity
          } else {
            _this.getActivity()
          }
        }
      })
    }
  },

  getActivity () {
      app.postRequest('/wx/activity/activity', 'POST', { consumerId: app.globalData.openid }, (res) => {
      // app.postRequest('/wx/activity/activity', 'POST', { consumerId: 'o3S065KtkR7Kp4Kr0jsSDE11bniI' }, (res) => {
        if (res.data.success) {
          let _myCardList = res.data.item
  
          _myCardList.map((item, index) => {
            let _item = item
            app.postRequest('/wx/cardRecord/hasCard', 'POST', { consumerId: item.consumerId }, (ret) => {
              _item.hasCard = ret.data.hasCardRecord
            })
          })
  
          this.setData({
            myCardList: res.data.item
          })
        }
      })
    // } else {

    // }
  },

  addCard(){
    wx.navigateTo({
      url: '../newCard/newCard',
    })
  },

  bindViewCard (e) {
    console.log(e)
    wx.navigateTo({
      url: '../activity/activity?acId=' + e.currentTarget.dataset.id,
    })
  }
})
