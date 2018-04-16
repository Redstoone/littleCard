// pages/carddetail/carddetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
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
    Bg:'',
    currentTab:0,
    items: [{ name: '添加文字' }, { name: '添加图片' }, { name: '添加音频' }, { name: '添加视频' }],
    thetxt:'',//活动文安
    files: [],//多图
    istext:false,
    isimage:false
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
    console.log(e.detail.value)
    var that = this;

    that.setData({
      wxtxt: e.detail.value
    })
  },
  next() {
    if (this.data.list[0].value.length == 0) {
      wx.showToast({
        title: '请输入活动名称！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (this.data.list[1].value.length == 0) {
      wx.showToast({
        title: '请输入群主简介！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (this.data.list[2].value.length == 0) {
      wx.showToast({
        title: '请输入打卡公告！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    if (this.data.wxtxt.length == 0) {
      wx.showToast({
        title: '请输入群主微信！',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }

    app.postRequest('/wx/activity/detail/add_second', 'POST', {
      mainDescription: this.data.list[1].value,
      activityNotice: this.data.list[2].value,
      mainWx: this.data.wxtxt,
      activityId: this.data.id,
      // id: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        wx.navigateTo({
          url: '../lookdetail/lookdetail?acId' + this.data.id,
        })
      }
    })
  },
  // onLoad(e) {
  //   var that = this;
  //   that.setData({
  //     'list[0].txtnum': e.title.length,
  //     'list[0].value': e.title,
  //     id: e.id
  //   })
  // },
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
          url: 'https://xgh.smarttinfo.com/wx/index/utoken',
          //url: 'https://union.wevirtus.cn/utoken',
          data: {
          },
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
                console.log(res, "11111data")
                var data = JSON.parse(res.data);
                that.setData({ 
                  camBg: 'http://tmp-qiniu.smarttinfo.com/' + data.key + '?imageView/2/w/120/h/120', 
                  isLogo: true,
                  key: data.key
                  })

                console.log(that.data.camBg)
              }
            })

          },
        })
      }
    })    
  },
  thetxtChange(e){//活动文案
    var that = this
      that.setData({
        thetxt: e.detail.value
      })
  },
  navbarTap(e){
    var that = this
    var idx = e.currentTarget.id
    console.log(e)
    if (idx == 0){
      that.setData({
        istext:true
      })
    }
    if (idx == 1) {
      that.setData({
        isimage: true
      })
    }    
    
  },
  hidetext(){
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

uploadImg(){//上传多图
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
          data: {
          },
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
                    let testImg ='http://tmp-qiniu.smarttinfo.com/' + data.key + '?imageView/2/w/120/h/120';
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

  }
  else {
    wx.showToast({
      title: "图片太多了~",
      icon: 'loading',
      duration: 2000
    })
  }


},
remove(e) {//多图删除
  var index = Number(e.currentTarget.id) 
var that = this
  var files = that.data.files;
  files.splice(index)
  that.setData({
    files: files
  })
},

})