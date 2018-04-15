const app = getApp();
Page({
  data: {
    recommand: [],
    user: null
  },

  onLoad() {
    app.postRequest('/wx/consumer/record', 'POST', { consumerId: app.globalData.openid }, (ret) => {
      this.setData({
        user: ret.data.item
      })
    })
    this.getCommandList()
  },

  getCommandList () {
    
    // app.postRequest('/wx/cardRecordComment/record', 'POST', { consumerId: app.globalData.openid }, (res) => {
    app.postRequest('/wx/cardRecordComment/record', 'POST', { consumerId: 1 }, (res) => {
      let _recommand = res.data.item
      _recommand.map((item, index) => {
        let _item = item
        _item.timeFormat = this.getTimeFormatText(_item.createTime)
        return _item
      })
      this.setData({
        recommand: _recommand
      })
    })
  },

  getTimeFormatText (date) {
    let minute = 60000;// 1分钟 
    let hour = 3600000;// 1小时 
    let day = 86400000;// 1天 
    let month = 2592000000;// 月 
    let year = 31104000000;// 年
  
    if (date == null) {
      return null;
    }
    let diff = new Date().getTime() - new Date(date).getTime();
    let r = 0;
    if (diff > year) {
      r = parseInt(diff / year)
      return r + "年前"
    }
    if (diff > month) {
      r = parseInt(diff / month)
      return r + "个月前"
    }
    if (diff > day) {
      r = parseInt(diff / day)
      return r + "天前"
    }
    if (diff > hour) {
      r = parseInt(diff / hour)
      return r + "小时前"
    }
    if (diff > minute) {
      r = parseInt(diff / minute)
      return r + "分钟前"
    }
    return "刚刚"
  }
})