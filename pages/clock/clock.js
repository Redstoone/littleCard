// pages/clock/clock.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [], //多图
    isUp: false,
    camvd: '', //视频
    currentCity:'',
    items: [
      { id: 1, value: '10', text: '对外公开', checked: true },
      { id: 2, value: '20', text: '群主和私人可见', checked: false },
      { id: 3, value: '30', text: '仅私人可见', checked: false }
      
    ],
    isLook:false,
    title: '',//感想
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inputTxt(e) {
    var that = this
    that.setData({
      title: e.detail.value
    })
  },

  push() { //发表日记
    var value;
    for (var i=0; i < this.data.items.length; i++){
      if (this.data.items[i].checked == true ){
        value = this.data.items[i].value
      }
    }
    app.postRequest('	/wx/cardRecord/merged', 'POST', {
      consumerId: app.globalData.openid,
      activityId: 1, //活动id
      viewType: value, //查看权限(10 对外公开 20群主和私人可见 30 仅私人可见)
      recordDescription: this.data.title, //日记内容
      recordPoint: this.data.currentCity, //地点
      recordDescImg:this.data.files,//图片
      recordDescVideo: this.data.camvd,//视频
    }, (res) => {
      if (res.data.success) {
        console.log("发表成功")
      }
    })
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
    if (that.data.files.length < 10) {
      var maxCount = 10 - that.data.files.length
      wx.chooseImage({
        count: maxCount, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          wx.request({
            url: 'https://xgh.smarttinfo.com/wx/index/utoken',
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
                      let testImg = 'http://tmp-qiniu.smarttinfo.com/' + data.key + '?imageView/2/w/120/h/120';
                      fileArr.push(testImg)
                      that.setData({
                        files: fileArr
                      })

                      console.log(that.data.files)

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
        title: "图片太多了~",
        icon: 'loading',
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


  changevd() { //上传视频
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePath;
        wx.request({
          url: 'https://xgh.smarttinfo.com/wx/index/utoken',
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
              filePath: tempFilePaths,
              name: 'file',
              formData: {
                'token': data.data.uptoken,
                'accept': 'text/plain'
              },
              success: function (res) {
                console.log(res, "11111data")
                var data = JSON.parse(res.data);
                that.setData({
                  camvd: 'http://tmp-qiniu.smarttinfo.com/' + data.key,
                  isLogo: true,
                  key: data.key
                })

                console.log(that.data.camvd)
              }
            })

          },
        })
      }
    })
  },

  getLocation: function () {//定位
  var that=this
    wx.getUserInfo({
      lang:'zh_CN',
      success: function (res) {
        var userInfo = res.userInfo
        var currentCity = userInfo.city
        that.setData({
          currentCity: currentCity
        })
      }
    })
  },
  getlook(){
    var that = this
    that.setData({
      isLook:true
    })
  },
  hideLook(){
    var that = this
    that.setData({
      isLook: false
    })    
  },
  radioChange: function (e) {//权限
    console.log(e)
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
      items: items
    })
  },
})