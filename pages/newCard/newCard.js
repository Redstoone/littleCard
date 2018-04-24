// pages/newCard/newCard.js
var utils = require("../../utils/util")
const app = getApp()

Page({
  data: {
    items: [{
        id: 1,
        value: '1',
        text: '不限日期，长期打卡',
        checked: true
      },
      {
        id: 2,
        value: '2',
        text: '指定开始结束日期',
        checked: false
      }
    ],
    title: '', //活动标题
    startTime: '', //开始时间
    overTime: '', //结束时间
    isTimeDisabled: true
  },
  radioChange: function (e) {
    var that = this;
    var items = [];
    for (var i = 0; i < that.data.items.length; i++) {
      var item = that.data.items[i]
      item.checked = false
      if (e.detail.value && e.detail.value === that.data.items[i].value) {
        item.checked = true
      }
      items.push(item)
    }
    that.setData({
      items: items,
      isTimeDisabled: items[0].checked ? true : false
    })
  },
  startTimeChange: function (e) {
    this.setData({
      startTime: utils.trim(e.detail.value)
    })
  },
  overTimeChange: function (e) {
    this.setData({
      overTime: utils.trim(e.detail.value)
    })
  },
  inputTxt(e) {
    var that = this
    that.setData({
      title: utils.trim(e.detail.value)
    })
  },
  next() {
    if (this.data.title.length == 0) {
      wx.showToast({
        title: '请输入活动名称！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.title.length > 20) {
      wx.showToast({
        title: '活动名称不能超过20个字',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.items[0].checked == true) {
      app.postRequest('/wx/activity/add_first', 'POST', {
        name: this.data.title,
        timeType: 10,
        consumerId: app.globalData.openid
      }, (res) => {
        if (res.data.success) {
          var title = res.data.item.name;
          var id = res.data.item.id
          wx.navigateTo({
            url: '../carddetail/carddetail?id=' + id + "&title=" + title,
          })
        }
      })
    } else {
      if (this.data.startTime == '') {
        wx.showToast({
          title: '请选择开始时间！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      if (this.data.overTime == '') {
        wx.showToast({
          title: '请选择结束时间！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      app.postRequest('/wx/activity/add_first', 'POST', {
        name: this.data.title,
        timeType: 20,
        consumerId: app.globalData.openid,
        startTime: this.data.startTime,
        overTime: this.data.overTime
      }, (res) => {
        if (res.data.success) {
          var title = res.data.item.name;
          var id = res.data.item.id
          wx.navigateTo({
            url: '../carddetail/carddetail?id=' + id + "&title=" + title,
          })
        }
      })
    }
  }
})