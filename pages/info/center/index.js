const app = getApp()

Page({
  data: {
    userInfo: null,
    // hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // avatarUrl: 'https://t10.baidu.com/it/u=3788365272,318725089&fm=173&app=25&f=JPEG?w=640&h=363&s=361016CC28B3EA475C13653D0300505A',
    // nickName: 'ken'
  },

  onLoad () {
    this.getUserInfo();
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo
    })
  }, 

  // 获取用户信息
  getUserInfo () {

  },

  navtoSetting () {
    wx.navigateTo({
      url: '/pages/info/setting/index'
    })
  },

  // 下拉刷新
  onPullDownRefresh () {
    wx.showNavigationBarLoading();
    var that = this;
  }

})