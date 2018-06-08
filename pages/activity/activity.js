// pages/activity/activity.js
let utils = require("../../utils/util")
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    week: '',
    name: "", //活动名称
    mainWx: "", //群主微信
    mainDescription: "",
    memberNumber: "", //参加人数
    cardClickNumber: "", //打卡次数
    activityNotice: '', //公告
    activityDescription: "",
    headicon: '', //头像
    nickname: '', //昵称
    totalms: '', //时间
    clock: '',
    startTime: '',
    isClick: true, //打卡状态
    acId: '',
    selectedId: 0,
    recommand: [],
    user: null,
    activityDetail: null,
    countDay: 0,
    activity: null,
    activityMember: null,
    activityDescImg: null,
    activityDescImgData: '',
    activityDescVideo: '',
    activityDescVideoData: '',
    isPlay: false,
    videoCtx: '',
    page: 1,
    size: 5,
    loading: false,
    loadingComplete: false,
    hasCardRecord: false,
    mineCountDay: 0,
    hasNotstart: false,
    isAddWx: false,
    isPlay: false,
    videoSrc: null
  },
  changeTab(e) {
    this.setData({
      selectedId: e.currentTarget.dataset.idx
    })
  },
  getWeek: function (week) {
    if (week >= 0 && week < 7) {
      switch (week) {
        case 0:
          {
            return "周日";
          }
        case 1:
          {
            return "周一";
          }
        case 2:
          {
            return "周二";
          }
        case 3:
          {
            return "周三";
          }
        case 4:
          {
            return "周四";
          }
        case 5:
          {
            return "周五";
          }
        case 6:
          {
            return "周六";
          }
      }
    }
  },
  getDateList: function () {
    let dateOfToday = Date.now()
    let dayOfToday = (new Date().getDay() + 7) % 7
    let daysOfThisWeek = Array.from(new Array(7))
      .map((_, i) => {
        let date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24),
          _year = date.getFullYear(),
          _month = date.getMonth() + 1,
          _day = date.getDate(),
          _d = _year +
          '-' +
          String(_month).padStart(2, '0') +
          '-' +
          String(_day).padStart(2, '0')

        return {
          str: _d === new Date().getFullYear() +
            '-' +
            String(new Date().getMonth() + 1).padStart(2, '0') +
            '-' +
            String(new Date().getDate()).padStart(2, '0') ? '今天' : '',
          d: _d,
          year: _year,
          month: _month,
          day: String(_day).padStart(2, '0')
        }
      })

    this.setData({
      years: daysOfThisWeek
    })
  },
  onLoad: function (e) {
    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      acId: e.acId
    })
    this.getUserInfo();
  },

  getInitData() {
    let that = this
    app.postRequest('/wx/activity/singleAll', 'POST', {
      id: that.data.acId
    }, (res) => {
      if (res.data.success) {
        // let item = res.data.item
        let activity = res.data.item;
        if (activity.timeType == 20) {
          activity.startDate = activity.startTime.substring(0, 10);
          activity.overDate = activity.overTime.substring(0, 10);
        }
        let imgs = []
        if (res.data.item.activityDetail.activityDescImg) {
          imgs = activity.activityDetail.activityDescImg.split(',');
          imgs = imgs.map((item, index) => {
            return {
              id: index,
              url: item,
              width: 0,
              height: 0
            }
          });
        }
        that.setData({
          activity: activity,
          name: activity.name,
          mainWx: activity.mainWx,
          mainDescription: activity.activityDetail.mainDescription,
          memberNumber: activity.memberNumber,
          cardClickNumber: activity.cardClickNumber,
          activityDescription: activity.activityDetail.activityDescription,
          activityNotice: activity.activityDetail.activityNotice,
          activityMemberHeader: activity.activityMember.slice(0, 3),
          activityDetail: activity.activityDetail,
          startTime: activity.startTime,
          activityDescImg: imgs,
          activityMember: activity.activityMember,
          activityDescVideo: activity.activityDetail.activityDescVideo,
          totalms: this.dateFormat(activity.startTime) + 86400000 - new Date().getTime(),
          hasNotstart: new Date(activity.startTime) - new Date() > 0 ? true : false,
          hasOver: new Date() > new Date(activity.overTime) ? true : false
        })
        that.countDown()
        app.postRequest('/wx/consumer/record', 'POST', {
          consumerId: activity.consumerId
        }, (ret) => {
          if (ret.data.success) {
            that.setData({
              user: ret.data.item
            })
          }
        })
      }
    })
    this.getDateList();
    wx.hideLoading();
  },

  getUserInfo() {
    let _this = this
    let us = app.globalData.userInfo
    if (us) {
      _this.setData({
        userInfo: us
      })
      _this.getInitData()
    } else {
      app.getUserInfo(function (openid, userInfo) {
        if (openid) {
          _this.setData({
            userInfo: userInfo
          })
          _this.getInitData()
        }
      })
    }
  },

  onShow(e) {
    this.getUserInfo();
    this.getCardRecordComment(this.data.acId);
    this.getHasCardRecord(this.data.acId)
    this.getCountDay(this.data.acId)
    this.getMineCountDay(app.globalData.openid, this.data.acId)
  },

  getCountDay(acId) {
    let that = this
    app.postRequest('/wx/cardRecord/countDay', 'POST', {
      consumerId: app.globalData.openid,
      activityId: acId
    }, (ret) => {
      if (ret.data.success) {
        that.setData({
          countDay: ret.data.item
        })
      }
    })
  },

  getMineCountDay(consumerId, acId) {
    let that = this
    app.postRequest('/wx/cardRecord/countDay', 'POST', {
      consumerId: consumerId,
      activityId: acId
    }, (ret) => {
      if (ret.data.success) {
        that.setData({
          mineCountDay: ret.data.item
        })
      }
    })
  },
  getCardRecordComment(acid) {
    let that = this
    let _data = {
      page: that.data.page,
      size: that.data.size,
      consumerId: app.globalData.openid,
      activityId: acid
    }
    app.postRequest('/wx/cardRecord/record', 'POST', _data, (res) => {
      let _recommand = res.data.rows

      _recommand.map((item, index) => {
        let _item = item,
          _isZan = false
        // _item.timeFormat = utils.formatTimeText(item.createTime)
        // _item.timeFormat = item.recordConsumer && item.recordConsumer.createTime ? item.recordConsumer.createTime : ''
        _item.timeFormat = item.createTime
        _item.zanList = _item.cardRecordPraiseList.map((item2, idx2) => {
          if (item2.consumerId == app.globalData.openid) {
            _isZan = true
          }
          return {
            consumerId: item2.consumerId,
            nickname: item2.praiseConsumer.nickname
          }
        })
        _item.isZan = _isZan
        _item.imgList = _item.recordDescImg ? _item.recordDescImg.split(',') : [];
        return _item
      })

      this.setData({
        recommand: _recommand,
      })

      if (res.data.rows.length < this.data.size) {
        that.setData({
          loadingComplete: true,
        })
      }
    })
  },
  getHasCardRecord(acid) {
    let that = this
    app.postRequest('/wx/cardRecord/hasCard', 'POST', {
      consumerId: app.globalData.openid,
      activityId: acid
    }, (res) => {
      if (res.data.success) {
        that.setData({
          hasCardRecord: res.data.hasCardRecord
        })
      }
    })
  },
  set() {
    wx.redirectTo({
      url: '/pages/info/setting/index',
    })
  },
  dateFormat(time) { //时间转换
    return new Date(time).getTime()
  },
  countDown() {
    let that = this
    // 渲染倒计时时钟
    let clock = this.date_format(this.data.totalms)
    that.setData({
      clock: clock
    })
    // if (this.data.totalms <= 0) {
    //   that.setData({
    //     clock: "点击打卡",
    //     isClick: true
    //   })
    //   // timeout则跳出递归
    //   return;
    // }
    setTimeout(() => {
      // 放在最后--
      that.setData({
        totalms: this.dateFormat(that.data.startTime) + 86400000 - new Date().getTime()
      })
      this.countDown()
    }, 1000)
  },
  // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
  date_format(micro) {
    micro = micro || 1
    // 秒数
    let second = Math.floor(micro / 1000);
    // 小时位
    let hr = Math.floor(second / 3600);
    // 分钟位
    let min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    let sec = this.fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => let sec = second % 60;

    if (hr) {
      return hr + ":" + min + ":" + sec;
    } else {
      return '00' + ':' + min + ":" + sec
    }
  },
  // 位数不足补零
  fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
  },


  clickCard() { //点击打卡
    if (this.data.isClick) { // 是不已打卡
      wx.navigateTo({
        url: '../clock/clock?acId=' + this.data.acId + '&activityTitle=' + this.data.name + '&mineCountDay=' + this.data.mineCountDay,
      })
    }

  },
  onShareAppMessage: function () { //分享
    return {
      title: "打卡", // 默认是小程序的名称(可以写slogan等)
      // path: '/pages/home/index',
      path: '/pages/lookdetail/lookdetail?acId=' + this.data.acId,
    }
  },

  bindComment(e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../comment/create/index?crid=' + _crid + '&cruid=' + _cruid
    })
  },

  bindZan(e) {
    let _crid = e.currentTarget.dataset.crid
    let _idx = e.currentTarget.dataset.idx
    app.postRequest('/wx/cardRecordPraise/click', 'POST', {
      consumerId: app.globalData.openid,
      cardRecordId: _crid
    }, (res) => {
      if (res.data.success) {
        this.data.recommand[_idx].isZan = true
        this.data.recommand[_idx].zanList.push({
          consumerId: app.globalData.openid,
          nickname: app.globalData.userInfo.nickname
        })

        this.setData({
          recommand: this.data.recommand
        })
      }
    })
  },

  gotoHome() {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },

  gotoClassify() {
    wx.switchTab({
      url: '/pages/classify/index'
    })
  },

  bindCommentDetail(e) {
    let _crid = e.currentTarget.dataset.crid
    let _cruid = e.currentTarget.dataset.cruid
    wx.navigateTo({
      url: '../comment/cardDiary/index?crid=' + _crid + '&cruid=' + _cruid
    })
  },

  imageLoad(e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = 710; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.activityDescImg;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id == imageId) {
        images[i].width = '100%';
        images[i].height = imgHeight;
        break;
      }
    }
    this.setData({
      activityDescImg: images
    })
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

  // 页面上拉触底事件的处理函数
  onReachBottom() {
    let that = this;
    if (!that.data.loadingComplete) {
      that.setData({
        page: that.data.page + 1,
        loading: true
      });
      let that = this
      let _data = {
        page: that.data.page,
        size: that.data.size,
        consumerId: app.globalData.openid,
        activityId: this.data.acid
      }
      app.postRequest('/wx/cardRecord/record', 'POST', _data, (res) => {
        let _recommand = res.data.rows
        _recommand.map((item, index) => {
          let _item = item,
            _isZan = false
          // _item.timeFormat = utils.formatTimeText(item.createTime)
          _item.timeFormat = item.createTime
          _item.zanList = _item.cardRecordPraiseList.map((item2, idx2) => {
            if (item2.consumerId == app.globalData.openid) {
              _isZan = true
            }
            return {
              consumerId: item2.consumerId,
              nickname: item2.praiseConsumer.nickname
            }
          })
          _item.isZan = _isZan
          _item.imgList = _item.recordDescImg ? _item.recordDescImg.split(',') : [];
          return _item
        })

        that.setData({
          recommand: that.data.recommand.concat(_recommand),
          loading: false
        })

        if (res.data.rows.length < this.data.size) {
          that.setData({
            loadingComplete: true,
          })
        }
      })
    }
  },

  // 编辑详情
  editActivity() {
    wx.navigateTo({
      url: '../carddetail/carddetail?id=' + this.data.acId,
    })
  },

  // 加微信
  addWx() {
    this.setData({
      isAddWx: true
    })
  },

  // 复制微信
  copyWx() {
    this.setData({
      isAddWx: false
    })
    wx.setClipboardData({
      data: this.data.mainWx,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功！',
              icon: 'success',
              duration: 1500
            })
          }
        })
      }
    })
  },

  // 关闭添加微信弹框
  closeWxbox() {
    this.setData({
      isAddWx: false
    })
  },

  // 图片预览
  previewImage(e) {
    var current = e.target.dataset.src;
    var idx = e.target.dataset.idx;
    wx.previewImage({
      current: current,
      urls: this.data.recommand[idx].imgList
    })
  },

  // 关闭视频
  videoClose() {
    this.setData({
      isPlay: false
    })
    this.videoCtx.pause();
    this.videoCtx.seek(0);
    this.videoCtx.exitFullScreen();
  },

  onReady(e) {
    this.videoCtx = wx.createVideoContext('prewVideo')
  },

  // 显示视频
  showVideo(e) {
    let videoSrc = e.currentTarget.dataset.src;
    this.setData({
      isPlay: true,
      videoSrc: videoSrc
    })
    this.videoCtx.seek(0);
    this.videoCtx.play();
    this.videoCtx.requestFullScreen();
  },


  // 视屏全屏
  bindVideoScreenChange(e) {
    let status = e.detail.fullScreen;
    let _isPlay = false;
    if (status) {
      _isPlay = true
    } else {
      this.videoCtx.pause();
    }
    this.setData({
      isPlay: _isPlay
    });
  },

  videoImageOnLoad(ev) {
    var idx = ev.target.dataset.idx;
    this.data.recommand[idx].videoImg = {
      w: 480,
      h: ev.detail.height * 480 / ev.detail.width
    }
    this.setData({
      recommand: this.data.recommand
    })
  }
})