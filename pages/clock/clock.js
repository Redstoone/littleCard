// pages/clock/clock.js
var utils = require("../../utils/util")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [], //多图
    isUp: false,
    camvd: '', //视频
    currentCity: '',
    items: [{
        id: 1,
        value: '10',
        text: '对外公开',
        checked: true
      },
      {
        id: 2,
        value: '20',
        text: '群主和私人可见',
        checked: false
      },
      {
        id: 3,
        value: '30',
        text: '仅私人可见',
        checked: false
      }
    ],
    isLook: false,
    title: '', //感想
    acid: null,
    viewText: '对外公开',
    isPlay: false,
    isPush: false,
    stepper1: {
      stepper: 0,
      min: -5,
      max: 5,
      step: .1
    },
    stepper2: {
      stepper: 0,
      min: -5,
      max: 5,
      step: .1
    },
    stepper3: {
      stepper: 0,
      min: -5,
      max: 5,
      step: .1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      acid: options.acId
    })
  },


  handleZanStepperChange(e) {
    const componentId = e.target.dataset.componentId;
    const stepper = e.detail;

    this.setData({
      [`${componentId}.stepper`]: stepper
    });
  },

  inputTxt(e) {
    var that = this
    that.setData({
      title: utils.trim(e.detail.value)
    })
  },

  bindCancel() {
    wx.navigateBack();
  },

  push() { //发表日记
    if (this.data.isPush) {
      return false
    }
    this.setData({
      isPush: true
    })
    if (!this.data.title) {
      wx.showToast({
        title: '发表日记不能为空',
        icon: 'none',
        duration: 1500,
      })
      return false;
    } else if (this.data.files.length >= 9) {
      wx.showToast({
        title: "最多只能上传9张图片",
        icon: 'none',
        duration: 2000
      })
    } else {
      var value;
      for (var i = 0; i < this.data.items.length; i++) {
        if (this.data.items[i].checked == true) {
          value = this.data.items[i].value
        }
      }
      app.postRequest('/wx/card/weight/merged', 'POST', {
        consumerId: app.globalData.openid,
        recordWeight: this.data.stepper1.stepper,
        recordWaist: this.data.stepper2.stepper,
        recordFat: this.data.stepper3.stepper,
      }, (res) => {
        console.log('weight====' + res.data.success);
      })

      app.postRequest('/wx/cardRecord/merged', 'POST', {
        consumerId: app.globalData.openid,
        activityId: this.data.acid, //活动id
        viewType: value, //查看权限(10 对外公开 20群主和私人可见 30 仅私人可见)
        recordDescription: this.data.title, //日记内容
        recordPoint: this.data.currentCity, //地点
        recordDescImg: this.data.files, //图片
        recordDescVideo: this.data.camvd, //视频
        recordDescVoice: '' // 音频
      }, (res) => {
        this.setData({
          isPush: false
        })
        if (res.data.success) {
          wx.showToast({
            title: '发表日记成功',
            icon: 'success',
            duration: 1500,
            success: function (ret) {
              wx.navigateBack();
            }
          })
        } else {
          wx.showToast({
            title: '今日已打卡',
            icon: 'success',
            duration: 1500
          })
        }
      })
    }
  },

  clickImg(e) {
    var that = this
    that.setData({
      isUp: true
    })
    that.uploadImg()
  },
  uploadImg() { //上传多图
    var that = this
    if (that.data.files.length < 9) {
      var maxCount = 10 - that.data.files.length
      wx.chooseImage({
        count: maxCount, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          wx.request({
            url: getApp().globalData.host + '/wx/index/utoken',
            data: {},
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded",
              'X-Requested-Page': 'json'
            },
            success: function (data) {

              for (let i = 0; i < res.tempFilePaths.length; i++) {
                wx.uploadFile({
                  url: 'https://up.qbox.me', //仅为示例，并非真实的接口地址
                  filePath: res.tempFilePaths[i],
                  name: 'file',
                  formData: {
                    'token': data.data.uptoken,
                    'accept': 'text/plain'
                  },
                  success: function (data) {
                    var data = JSON.parse(data.data)
                    if (data.key) {
                      var fileArr = that.data.files
                      let testImg = 'http://tmp-qiniu.smarttinfo.com/' + data.key;
                      // + '?imageView/2/w/120/h/120'
                      fileArr.push(testImg)
                      that.setData({
                        files: fileArr
                      })
                    } else {
                      wx.showToast({
                        title: "图片上传失败",
                        icon: 'loading',
                        duration: 2000
                      })
                    }
                  }
                })
              }

            },
          })
        }
      })
    } else {
      wx.showToast({
        title: "最多只能上传9张图片",
        icon: 'none',
        duration: 2000
      })
    }


  },
  remove(e) { //多图删除
    var index = Number(e.currentTarget.id)
    var that = this
    var files = that.data.files;
    files.splice(index)
    that.setData({
      files: files
    })
  },

  removeVideo() {
    this.setData({
      camvd: ''
    })
  },

  changevd() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var tempFilePaths = res.tempFilePath;
        wx.showLoading({
          title: '视频上传中'
        })
        wx.request({
          url: getApp().globalData.host + '/wx/index/utoken',
          data: {},
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'X-Requested-Page': 'json'
          },
          success: function (data) {
            wx.uploadFile({
              url: 'https://up.qbox.me',
              filePath: tempFilePaths,
              name: 'file',
              formData: {
                'token': data.data.uptoken,
                'accept': 'text/plain'
              },
              success: function (res) {
                var data = JSON.parse(res.data);
                if (data.key) {
                  that.setData({
                    camvd: 'http://tmp-qiniu.smarttinfo.com/' + data.key,
                    isLogo: true,
                    key: data.key
                  })
                  wx.hideLoading()
                } else {
                  wx.showToast({
                    title: "视频上传失败",
                    icon: 'loading',
                    duration: 2000
                  })
                }
              }
            })
          },
        })
      }
    })
  },

  getLocation: function () { //定位
    var that = this
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var userInfo = res.userInfo
        var currentCity = userInfo.city
        that.setData({
          currentCity: currentCity
        })
      }
    })
  },
  getlook() {
    var that = this
    that.setData({
      isLook: true
    })
  },
  hideLook() {
    var that = this
    that.setData({
      isLook: false
    })
  },
  radioChange: function (e) { //权限
    var that = this;
    var items = [];
    var _viewtext = ''
    for (var i = 0; i < that.data.items.length; i++) {
      var item = that.data.items[i]
      item.checked = false
      if (e.detail.value && e.detail.value === that.data.items[i].value) {
        item.checked = true
        _viewtext = item.text
      }
      items.push(item)
    }
    that.setData({
      items: items,
      viewText: _viewtext
    })
  },

  videoClose() {
    this.setData({
      isPlay: false
    })
    this.videoCtx.pause();
    this.videoCtx.seek(0);
  },

  onReady(e) {
    this.videoCtx = wx.createVideoContext('myVideo')
  },
  showVideo() {
    this.setData({
      isPlay: true
    })
    this.videoCtx.play()
  },
})