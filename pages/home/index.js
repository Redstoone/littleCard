//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    myCardList: [
      {
        id: 1,
        imgurl: '/images/index/card_pic.png',
        title: '早点喝水',
        isMy: 1,
        time: '6:00:00',
        memberClick: 20,
      }, {
        id: 1,
        imgurl: '/images/index/card_pic.png',
        title: '户外锻炼',
        isMy: 0,
        time: '16:00:00',
        memberClick: 20,
      }
    ],
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
    let _this = this
    let us = wx.getStorageSync('userInfo')
    if (us) {
      _this.setData({
        userInfo: JSON.parse(us)
      })      
    } else {
      app.getUserInfo(function (userInfo) {
        if (userInfo) {
          _this.setData({
            userInfo: userInfo
          })
        }
      })      
    }
  },
})
