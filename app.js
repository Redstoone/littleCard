//app.js
App({
  onLaunch: function () {
    // this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var _this = this
      //调用登录接口
    wx.login({
      success: function (e) {
        wx.getUserInfo({
          lang: 'zh_CN',
          success: function (res) {
            _this.globalData.userInfo = res.userInfo
            _this.getOpenId(e.code, cb)
            // wx.setStorageSync('userInfo', JSON.stringify(res.userInfo))
            // typeof cb == "function" && cb(_this.globalData.userInfo)
          }, fail: function(res) {
            wx.showModal({
              title: '温馨提示',
              content: '若不授权登录，则无法使用该小程序；点击授权，勾选‘用户信息’方可继续使用；或者，在微信[发现]－[小程序]，删除该小程序，重新搜索该小程序，方可使用。',
              cancelText: '不授权',
              confirmText: '授权',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (r) => {
                      wx.getUserInfo({
                        success: function (res) {
                          // _this.globalData.userInfo = res.userInfo
                          _this.getOpenId(e.code)
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  getOpenId (code, cb) {
    let _this = this
    this.postRequest("/wx/wechat/openid", 'POST', { code: code }, (res) => {
      if (res.data.success) {
        this.globalData.openid = res.data.openid
        // wx.setStorageSync('openid', res.data.openid)
        _this.postRequest('/wx/consumer/record', 'POST', { consumerId: res.data.openid }, (rst) => {
          if (rst.data.item) {
            _this.globalData.userInfo = rst.data.item
            typeof cb == "function" && cb(res.data.openid, rst.data.item)
          } else {
            typeof cb == "function" && cb(res.data.openid, _this.globalData.userInfo)
            _this.postRequest("/wx/wechat/logged", 'POST', {
              id: res.data.openid,
              nickname: _this.globalData.userInfo.nickName,
              headicon: _this.globalData.userInfo.avatarUrl,
              gender: _this.globalData.userInfo.gender,
              province: _this.globalData.userInfo.province,
              city: _this.globalData.userInfo.city,
              county: _this.globalData.userInfo.country
            }, (rst) => {
              if (rst.data.success){
                console.log('login success')
              }
            })
          }
        })
      }
    })
  },
  postRequest: function (url, method, data, fn) {
    let _this = this
    // let userInfo = {}
    // if (this.globalData.userInfo) {
    //   userInfo = this.globalData.userInfo
    // } else {
    //   //userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    // }
    let datas = Object.assign(data)
    wx.request({
      url: _this.globalData.host + url,
      method: method,
      header: { 'Content-type': 'application/x-www-form-urlencoded' },
      data: datas,
      success: function (res) {
        fn(res)
      },
      faile: function (err) { console.log(err) }
      // complete: function(obj) { console.log(obj) }
    })
  },
  globalData: {
    userInfo: null,
    host: 'https://xdk.smarttinfo.com',
    nickname: '',
    headicon: '',
    openid: null
  }
})