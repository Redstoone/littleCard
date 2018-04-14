//app.js
App({
  onLaunch: function () {
  },
  getUserInfo: function (cb) {
    var _this = this
      //调用登录接口
    wx.login({
      success: function (e) {
        console.log(e)
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            _this.globalData.userInfo = res.userInfo
            _this.getOpenId(e.code)
            typeof cb == "function" && cb(_this.globalData.userInfo)
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
                          _this.globalData.userInfo = res.userInfo
                          // _this.getOpenId(e.code)
                          typeof cb == "function" && cb(_this.globalData.userInfo)
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
  getOpenId (code) {
    this.postRequest("/wx/wechat/openid", 'GET', { code: code }, (data) => {
      console.log(data)
    })
  },
  postRequest: function (url, method, data, fn) {
    let _this = this
    let userInfo = {}
    if (this.globalData.userInfo) {
      userInfo = this.globalData.userInfo
    } else {
      userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    }
    let para = {
      openid: userInfo.openid
    }
    let datas = Object.assign(para, data) 
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
    host: 'http://8h8ebu.natappfree.cc/wx',
    nickname: '',
    headicon: ''
  }
})