// pages/clock/clock.js
let utils = require("../../utils/util")
const app = getApp()
Page({
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
    showPoster: false,
    maskHidden: true,
    userInfo: null,
    head_img: null,
    day: 0,
    activityTitle: '',
    imagePath: '',
    monthList: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    // isPoster: false,
    txtList: [
      ['再长的路一步步也能走完，', '再短的路不迈开双腿也无法到达。'],
      ['点滴汇聚无际，', '习惯决定未来。'],
      ['我不怕千万人阻挡，', '只怕自己投降。'],
      ['既然选择了远方，', '便只顾风雨兼程。'],
      ['不堕于过往，', '不荒废远方。'],
      ['世上没有绝望的处境，', '只有对处境绝望的人。'],
      ['真正的失败只有一种可能，', '那就是放弃。'],
      ['人生只有走出来的美丽，', '没有等出来的辉煌。'],
      ['人生的烦恼，多在于想的太多，', '而做的太少。'],
      ['最大的幸福莫过于有梦可追,', '有事可做,有人可爱。'],
    ],
    qrcodeImg: '/images/qrcode.jpg',
    tmpDomain: app.globalData.tmp_domain + '/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      acid: options.acId,
      activityTitle: options.activityTitle,
      day: parseInt(options.mineCountDay) + 1,
      userInfo: app.globalData.userInfo,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          imageWidht: res.windowWidth * 0.65,
          imageHeight: res.windowWidth * 0.65 * 1040 / 640
        });
      }
    });
    // this.setCurrDate(111)
    // this.handlePoster();
    // this.getImageInfo(app.globalData.userInfo.headicon)
    this.getQrcode(options.acId);
  },

  getQrcode(acId) {
    let that = this;
    wx.getImageInfo({ // 小程序获取图片信息API
      src: 'https://daka.spacet.cn/wx/activity/qrcode.png?acId=' + acId,
      success: function (res) {
        that.setData({
          qrcodeImg: res.path
        })
      },
      fail(err) {
        console.log(err, '下载图片失败')
      }
    })

    // wx.saveFile({
    //   tempFilePath: '/wx/activity/qrcode.png?acId=' + acId,
    //   success: function (res) {
    //     var savedFilePath = res.savedFilePath
    //   }
    // })
  },

  inputTxt(e) {
    let that = this
    that.setData({
      title: utils.trim(e.detail.value)
    })
  },

  bindCancel() {
    wx.navigateBack();
  },

  push() { //发表日记
    let that = this;
    if (this.data.isPush) {
      return false
    }
    this.setData({
      isPush: true
    })
    if (!this.data.title) {
      wx.showToast({
        title: '发表日记内容不能为空',
        icon: 'none',
        duration: 1500,
      })
      return false;
    } else if (this.data.title.length > 250) {
      wx.showToast({
        title: '发表日记内容长度不能超过250个字符',
        icon: 'none',
        duration: 1500,
      })
      return false;
    } else if (this.data.files.length > 9) {
      wx.showToast({
        title: "最多只能上传9张图片",
        icon: 'none',
        duration: 2000
      })
    } else {
      let value;
      for (let i = 0; i < this.data.items.length; i++) {
        if (this.data.items[i].checked == true) {
          value = this.data.items[i].value
        }
      }
      wx.showLoading({
        title: '保存中...',
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
        that.setData({
          isPush: false
        })
        if (res.data.success) {
          // wx.showToast({
          //   title: '发表日记成功',
          //   icon: 'success',
          //   duration: 1500,
          //   success: function (ret) {
          // wx.navigateBack();
          // that.setData({
          //   showPoster: true
          // })
          // }
          // })
          that.createNewImg();
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
    let that = this
    that.setData({
      isUp: true
    })
    that.uploadImg()
  },
  // 最多只能上传三张图
  uploadImg() { //上传多图
    let that = this
    if (that.data.files.length <= 9) {
      let maxCount = 9 - that.data.files.length
      wx.chooseImage({
        count: maxCount, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths
          wx.request({
            url: getApp().globalData.host + '/wx/index/utoken',
            // data: { 'bucket': 'card-tmp' },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded",
              'X-Requested-Page': 'json'
            },
            success: function (data) {
              for (let i = 0; i < res.tempFilePaths.length; i++) {
                let uuidKey = utils.uuid();
                wx.uploadFile({
                  url: 'https://upload-z2.qiniup.com', //仅为示例，并非真实的接口地址
                  filePath: res.tempFilePaths[i],
                  name: 'file',
                  formData: {
                    'token': data.data.uptoken,
                    'accept': 'text/plain',
                    'key': uuidKey
                  },
                  success: function (data) {
                    let _data = JSON.parse(data.data)
                    if (_data.key) {
                      let fileArr = that.data.files
                      // let testImg = 'http://card-tmp.spacet.cn/' + _data.key;
                      let testImg = _data.key;
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
        title: "最多只能上传3张图片",
        icon: 'none',
        duration: 2000
      })
    }
  },
  remove(e) { //多图删除
    let index = Number(e.currentTarget.id)
    let that = this
    let files = that.data.files;
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


  // 选择上传视频
  changevd() {
    let that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        let tempFilePaths = res.tempFilePath;
        wx.showLoading({
          title: '视频上传中'
        })
        wx.request({
          url: getApp().globalData.host + '/wx/index/utoken',
          // data: { 'bucket': 'card-tmp' },
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'X-Requested-Page': 'json'
          },
          success: function (data) {
            wx.uploadFile({
              url: 'https://upload-z2.qiniup.com',
              filePath: tempFilePaths,
              name: 'file',
              formData: {
                'token': data.data.uptoken,
                'accept': 'text/plain'
              },
              success: function (res) {
                let data = JSON.parse(res.data);
                if (data.key) {
                  that.setData({
                    camvd: 'http://card-tmp.spacet.cn/' + data.key,
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

  // 获取地址
  getLocation: function () { //定位
    let that = this
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        let userInfo = res.userInfo
        let currentCity = userInfo.city
        that.setData({
          currentCity: currentCity
        })
      }
    })
  },
  getlook() {
    let that = this
    that.setData({
      isLook: true
    })
  },
  hideLook() {
    let that = this
    that.setData({
      isLook: false
    })
  },
  radioChange: function (e) { //权限
    let that = this;
    let items = [];
    let _viewtext = ''
    for (let i = 0; i < that.data.items.length; i++) {
      let item = that.data.items[i]
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

  // 图片缓存本地
  getImageInfo(url) {
    if (typeof url === 'string') {
      wx.getImageInfo({ // 小程序获取图片信息API
        src: url,
        success: function (res) {
          this.setData({
            head_img: res.path
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },

  // 点击生成海报按钮
  handlePoster(e) {
    this.setData({
      showPoster: false
    })
    let that = this;
    wx.getSetting({ // 获取用户设置
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) { // 如果用户之前拒绝了授权
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.imagePath,
                success: function (data) {
                  console.log('保存图片成功')
                  wx.navigateBack();
                },
                fail: function (err) {
                  wx.showToast({
                    title: '保存图片失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail() {
              console.log('用户拒绝授权')
            }
          })
        } else { // 用户已经授权
          wx.saveImageToPhotosAlbum({
            filePath: that.data.imagePath,
            success: function (data) {
              console.log('保存图片成功')
              wx.navigateBack();
            },
            fail: function (err) {
              wx.showToast({
                title: '保存图片失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  createNewImg: function () {
    wx.showLoading({
      title: '生成分享海报',
    })
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    let imgNum = Math.floor(Math.random() * 5 + 1);
    var path = `/images/poster/poster${imgNum}.jpg`;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 640, 1040);
    context.drawImage(path, 0, 0, 640, 630);
    this.setCurrDate(imgNum, context);
    this.setBeautifulSentence(imgNum, context);
    this.setName(context);
    this.setDay(context);
    this.setTitle(context);
    context.drawImage(this.data.qrcodeImg, 239, 827, 162, 162);
    this.setTip(context);
    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          wx.hideLoading();
          let tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            showPoster: true
          });
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '生成海报失败',
            icon: 'success',
            duration: 1500,
          })
        }
      });
    }, 1000);
  },

  // 将时间绘制到canvas
  setCurrDate(imgNum, context) {
    let myDate = new Date(),
      year = myDate.getFullYear(),
      month = this.data.monthList[myDate.getMonth()],
      day = myDate.getDate();

    if (imgNum >= 3) {
      context.setFillStyle("#ffffff");
      context.setStrokeStyle("#ffffff");
    } else {
      context.setFillStyle("#464646");
      context.setStrokeStyle("#464646");
    }
    context.setFontSize(32);
    context.save();
    context.textAlign = "center";
    context.fillText(month, 320, 70); //必须为（0,0）原点
    context.setFontSize(40);
    context.fillText(day, 320, 120); //必须为（0,0）原点
    context.setFontSize(22);
    context.fillText(year, 320, 150); //必须为（0,0）原点
    context.restore();
    context.stroke();

    context.setLineWidth(2)

    context.moveTo(280, 80)
    context.lineTo(360, 80)

    context.moveTo(280, 160)
    context.lineTo(360, 160)
  },

  // 将美句绘制到canvas
  setBeautifulSentence(imgNum, context) {
    let txtNum = Math.floor(Math.random() * 10);
    // context.setFontSize(36);
    if (imgNum >= 3) {
      context.setFillStyle("#ffffff");
    } else {
      context.setFillStyle("#464646");
    }
    context.save();
    context.textAlign = "center";
    context.font = 'normal bold 36px STZhongsong';
    context.fillText(this.data.txtList[txtNum][0], 320, 494);
    context.fillText(this.data.txtList[txtNum][1], 320, 542);
    context.restore();
    context.stroke();
  },

  // 将头像绘制到canvas 
  setHeadImg(context) {
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    // context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(this.data.head_img, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
    context.draw();
  },

  // 将姓名绘制到canvas
  setName(context) {
    context.setFontSize(36);
    context.setFillStyle("#626262");
    context.save();
    context.textAlign = "center";
    context.fillText(this.data.userInfo.nickname, 320, 690); //必须为（0,0）原点
    context.restore();
    context.stroke();
  },

  setDay(context) {
    context.save();
    context.textAlign = "center";
    context.setFontSize(24);
    context.setFillStyle("#999");
    context.fillText(`第        天`, 320, 742); //必须为（0,0）原点
    context.setFontSize(42);
    context.setFillStyle("#626262");
    context.fillText(`${this.data.day}`, 320, 742); //必须为（0,0）原点
    context.restore();
    context.stroke();
  },

  setTitle(context) {
    context.setFontSize(28);
    context.setFillStyle("#626262");
    context.save();
    context.textAlign = "center";
    context.fillText(`${this.data.activityTitle}`, 320, 786); //必须为（0,0）原点
    context.restore();
    context.stroke();
  },

  setTip(context) {
    context.setFontSize(20);
    context.setFillStyle("#838383");
    context.save();
    context.textAlign = "center";
    context.fillText(`长按识码我们一起成长`, 320, 1020); //必须为（0,0）原点
    context.restore();
    context.stroke();
  },

  goback() {
    wx.navigateBack();
  }
})