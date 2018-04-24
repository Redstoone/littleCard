const app = getApp()
Page({
  data: {
    headicon: '',
    nickname: '',
    region: ['北京市', '', ''],
    customItem: '全部',
    genderArray: ['未知', '男', '女'],
    gender: 0,
    genderName: '未知',
    phone: '',
    realname: '',
    brithDate: '',
    sign: ''
  },

  onLoad() {
    this.getUserinfo()
  },

  getUserinfo() {
    app.postRequest('/wx/consumer/record', 'POST', {
      consumerId: app.globalData.openid
    }, (res) => {
      let _genderName = '未知'
      if (res.data.item.gender === 1) {
        _genderName = '男'
      } else if (res.data.item.gender === 2) {
        _genderName = '女'
      }
      this.setData({
        headicon: res.data.item.headicon,
        gender: res.data.item.gender,
        nickname: res.data.item.nickname,
        genderName: _genderName,
        brithDate: res.data.item.brithDate == 'undefined' ? '' : res.data.item.brithDate,
        sign: res.data.item.sign == 'undefined' ? '' : res.data.item.sign,
        realname: res.data.item.realname == 'undefined' ? '' : res.data.item.realname,
        phone: res.data.item.phone == 'undefined' ? '' : res.data.item.phone,
        region: [res.data.item.province, res.data.item.city, '']
      })
    })
  },

  bindDateChange: function (e) {
    this.setData({
      brithDate: e.detail.value
    })
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
  camSignTxt: function (e) {
    var that = this
    that.setData({
      sign: e.detail.value
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
        wx.request({
          url: 'https://xgh.smarttinfo.com/wx/index/utoken',
          data: {},
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'X-Requested-Page': 'json'
          },
          success: function (data) {
            wx.uploadFile({
              url: 'https://up.qbox.me',
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                'token': data.data.uptoken,
                'accept': 'text/plain'
              },
              success: function (res) {
                var data = JSON.parse(res.data);
                that.setData({
                  headicon: 'http://tmp-qiniu.smarttinfo.com/' + data.key,
                })
              }
            })
          }
        })
      }
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  //提交信息
  submit() {
    if (this.data.nickname.length == 0) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }

    app.postRequest('/wx/consumer/merged', 'POST', {
      id: app.globalData.openid,
      nickname: this.data.nickname,
      headicon: this.data.headicon,
      gender: this.data.gender,
      province: this.data.region[0],
      city: this.data.region[1],
      county: this.data.region[2],
      phone: this.data.phone,
      realname: this.data.realname,
      sign: this.data.sign,
      brithDate: this.data.brithDate
    }, (res) => {
      if (res.data.success) {
        wx.showToast({
          title: '修改资料成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: '修改资料失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  }
})