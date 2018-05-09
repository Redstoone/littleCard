// pages/carddetail/carddetail.js
var utils = require("../../utils/util")
const app = getApp()

Page({
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
    id: '',
    Bg: '',
    currentTab: 0,
    items: [{
      name: '添加文字',
      icon: 'icon-post'
    }, {
      name: '添加图片',
      icon: 'icon-album'
    }, {
      name: '添加音频',
      icon: 'icon-voicelight'
    }, {
      name: '添加视频',
      icon: 'icon-shipin1'
    }],
    thetxt: '', //活动文安
    files: [], //多图
    istext: false,
    isimage: false,
    isvd: false,
    filesvd: [],
    isaudio: false,
    camBg: 'http://tmp-qiniu.smarttinfo.com/Ftqw4KzWdVCSWEIM5r3M4-GKNxeO?imageView/2/w/750/h/300',
    isPlay: false
  },

  onLoad(option) {
    this.setData({
      id: option.id,
      'list[0].value': option.title
    })
    // this.getSingleDetail(option.id)
  },

  // 获取活动详情
  getSingleDetail(acid) {
    let that = this
    app.postRequest('/wx/activity/detail/singleDetail', 'POST', {
      activityId: acid
    }, (res) => {
      let _detail = res.data.item
      that.setData({
        'list[0].value': _detail.name,
        camBg: _detail.activityThumb,
        'list[2].value': _detail.activityNotice,
        thetxt: _detail.activityDescription,
        files: _detail.activityDescImg.split(','),
        filesvd: _detail.activityDescVideo.split(','),
        wxtxt: _detail.mainWx
      })
    })
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
    var that = this;

    that.setData({
      wxtxt: e.detail.value
    })
  },
  next() {
    if (utils.trim(this.data.list[0].value).length == 0) {
      wx.showToast({
        title: '请输入活动名称！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (utils.trim(this.data.list[1].value).length == 0) {
      wx.showToast({
        title: '请输入群主简介！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (utils.trim(this.data.list[2].value).length == 0) {
      wx.showToast({
        title: '请输入打卡公告！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (utils.trim(this.data.wxtxt).length == 0) {
      wx.showToast({
        title: '请输入群主微信！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.files.length > 6) {
      wx.showToast({
        title: "最多只能上传6张图片",
        icon: 'none',
        duration: 1500
      })
    } else {
      app.postRequest('/wx/activity/detail/add_second', 'POST', {
        mainDescription: this.data.list[1].value,
        activityNotice: this.data.list[2].value,
        mainWx: this.data.wxtxt,
        activityId: this.data.id,
        activityThumb: this.data.camBg,
        activityDescription: this.data.thetxt,
        activityDescImg: this.data.files,
        activityDescVideo: this.data.filesvd,
        // id: app.globalData.openid
      }, (res) => {
        if (res.data.success) {
          wx.redirectTo({
            url: '../lookdetail/lookdetail?acId=' + this.data.id,
          })
        }
      })
    }

  },

  changeBg() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.request({
          url: getApp().globalData.host + '/wx/index/utoken',
          //url: 'https://union.wevirtus.cn/utoken',
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
                  camBg: 'http://tmp-qiniu.smarttinfo.com/' + data.key + '?imageView/2/w/750/h/300',
                  isLogo: true,
                  key: data.key
                })
              }
            })

          },
        })
      }
    })
  },
  thetxtChange(e) { //活动文案
    var that = this
    that.setData({
      thetxt: e.detail.value
    })
  },
  navbarTap(e) {
    var that = this
    var idx = e.currentTarget.id
    if (idx == 0) {
      that.setData({
        istext: true
      })
    }
    if (idx == 1) {
      that.setData({
        isimage: true
      })
    }
    if (idx == 2) { //音频
      that.setData({
        isaudio: true
      })
    }
    if (idx == 3) {
      that.setData({
        isvd: true
      })
    }
  },
  hidetext() {
    var that = this
    that.setData({
      istext: false
    })
  },
  hideimage() {
    var that = this
    that.setData({
      isimage: false
    })
  },
  hidevd() {
    var that = this
    that.setData({
      isvd: false
    })
  },
  uploadImg() { //上传多图
    var that = this
    if (that.data.files.length <= 6) {
      var maxCount = 6 - that.data.files.length
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
        title: "最多只能上传6张图片",
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 多图删除
  remove(e) {
    let index = Number(e.currentTarget.id)
    let that = this
    let files = that.data.files;
    files.splice(index)
    that.setData({
      files: files
    })
  },

  // 上传多视频
  uploadvd() {
    let that = this
    // if (that.data.files.length < 10) {
      // let maxCount = 10 - that.data.files.length
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function (res) {
          let tempFilePaths = res.tempFilePath
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
                  let data = JSON.parse(res.data);
                  if (data.key) {
                    let fileArr = that.data.filesvd
                    let testImg = 'http://tmp-qiniu.smarttinfo.com/' + data.key
                    fileArr.push(testImg)
                    that.setData({
                      filesvd: fileArr
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
    // }
  },

  // 多视频删除
  removevd(e) {
    let index = Number(e.currentTarget.id)
    let that = this
    let filesvd = that.data.filesvd;
    filesvd.splice(index)
    that.setData({
      filesvd: filesvd
    })
  },

  // 音频提示
  audioBtn() {
    let that = this
    that.setData({
      isaudio: false
    })
  },

  onReady(e) {
    this.videoCtx = wx.createVideoContext('myVideo')
  },

  // 打开视频弹框
  showVideo() {
    this.setData({
      isPlay: true
    })
    this.videoCtx.play()
  },

  // 删除视频
  removeVideo() {
    this.setData({
      filesvd: []
    })
  },

  // 关闭视频弹框
  videoClose() {
    this.setData({
      isPlay: false
    })
    this.videoCtx.pause();
    this.videoCtx.seek(0);
  },
})