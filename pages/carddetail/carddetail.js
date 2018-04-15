// pages/carddetail/carddetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        name: '活动名称',
        place: '请输入活动名称',
        isInp: true,
        value: '',
        id: 0,
        txtnum: 0
      },
      {
        name: '群主简介',
        place: '请输入群主简介',
        isInp: false,
        value: '',
        id: 1,
        txtnum: 0
      },
      {
        name: '打卡公告',
        place: '请输入打卡公告',
        isInp: false,
        value: '',
        id: 2,
        txtnum: 0
      },
    ],
    wxtxt: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  txtChange(e) {
    var that = this
    var idx = Number(e.currentTarget.dataset.index);
    if (idx == 0) {
      that.setData({
        'list[0].txtnum': e.detail.value.length,
        'list[0].value': e.detail.value
      })
    }
    if (idx == 1) {
      that.setData({
        'list[1].txtnum': e.detail.value.length,
        'list[1].value': e.detail.value
      })
    }
    if (idx == 2) {
      that.setData({
        'list[2].txtnum': e.detail.value.length,
        'list[2].value': e.detail.value
      })
    }
  },
  wxtxt(e) {
    console.log(e.detail.value)
    var that = this;

    that.setData({
      wxtxt: e.detail.value
    })
  },
  next() {
    if (this.data.list[0].value.length == 0) {
      wx.showToast({
        title: '请输入活动名称！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (this.data.list[1].value.length == 0) {
      wx.showToast({
        title: '请输入群主简介！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (this.data.list[2].value.length == 0) {
      wx.showToast({
        title: '请输入打卡公告！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (this.data.wxtxt.length == 0) {
      wx.showToast({
        title: '请输入群主微信！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }

    app.postRequest('/wx/activity/detail/add_second', 'POST', {
      mainDescription: this.data.list[1].value,
      activityNotice: this.data.list[2].value,
      mainWx: this.data.wxtxt,
      activityId: this.data.id,
      // id: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        wx.navigateTo({
          url: '../lookdetail/lookdetail?acId' + this.data.id,
        })
      }
    })
  },
  onLoad(e) {
    var that = this;
    that.setData({
      'list[0].txtnum': e.title.length,
      'list[0].value': e.title,
      id: e.id
    })
  }
})