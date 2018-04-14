Page({
  data: {
    headicon: 'https://t10.baidu.com/it/u=3788365272,318725089&fm=173&app=25&f=JPEG?w=640&h=363&s=361016CC28B3EA475C13653D0300505A',
    nickname: 'ken',
    region: ['北京市', '北京市', ''],
    customItem: '全部',
    genderArray: ['未知', '男', '女'],
    gender: 0,
    genderName: '未知',
    phone: '',
    realname: ''
  },

  camNicknameTxt: function (e) {
    var that = this
    that.setData({
      nickname: e.detail.value
    })
  },
  camPhoneTxt: function (e) {
    var that = this
    that.setData({
      phone: e.detail.value
    })
  },
  camRealnameTxt: function (e) {
    var that = this
    that.setData({
      realname: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      gender: e.detail.value,
      genderName: this.data.genderArray[e.detail.value]
    })
  },

  changeAvatar() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
      }
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  //提交信息
  submit () {
    if (this.data.nickname.length == 0) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
  }
})