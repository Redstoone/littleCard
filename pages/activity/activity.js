// pages/activity/activity.js
var utils = require("../../utils/util")
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
    activityMember: null,
    activityDescImg: null,
    activityDescImgData: '',
    activityDescVideo: '',
    activityDescVideoData: '',
    isPlay: false,
    videoCtx: ''

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
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate() - (new Date().getDay() + 7) % 7;
    var week = time.getDay();
    var today = month + "/" + day;
    //当月天数
    var count = new Date(year, month, 0).getDate();
    console.log(count)
    var list = [];
    var newList = [
      []
    ];
    for (var i = 0; i < 7; i++) {
      var _week = (week + i) % 7; //星期
      var str = (day + i == time.getDate() ? "今天" : (day + i + 1 == time.getDate() + 1 ? "明天" : (day + i + 2 == time.getDate() + 2 ? "后天" : this.getWeek(_week))));
      var _month = month + parseInt((day + i) / count); //月份
      var _count = new Date(year, (month + 1), 0).getDate(); //当月天数
      var _day = 0;
      if ((day + i >= count + _count) || parseInt((day + i) / count) == 2) {
        _month = month + 1 + parseInt((day + i - count) / _count);
        _day = (day + i - count) % _count;
      } else {
        _day = (day + i) % count; //日期
        _count = 0;
      }
      if (_day == 0) {
        _month -= 1;
        _day = _count || count;
      }
      if (_month - month != newList.length - 1) {
        newList.push([]);
      }
      newList[_month - month].push({
        str: str.replace(/周[\s|\S]$/, ''),
        year: year,
        month: _month,
        week: _week,
        day: (_day < 10 ? "0" : "") + _day,
        isDate: true
      });
    }
    console.log(newList)
    // newList[0][0].day = "今天"
    this.setData({
      week: week,
      years: newList
    })
  },
  clickChecked(e) {
    console.log(e)
  },
  onLoad: function (e) {
    var that = this
    that.setData({
      acId: e.acId
    })
    app.postRequest('/wx/activity/singleAll', 'POST', {
      id: e.acId
    }, (res) => {
      if (res.data.success) {
        var item = res.data.item
        that.setData({
          name: item.name,
          mainWx: item.mainWx,
          mainDescription: item.activityDetail.mainDescription,
          memberNumber: item.memberNumber,
          cardClickNumber: item.cardClickNumber,
          activityDescription: item.activityDetail.activityDescription,
          activityNotice: item.activityDetail.activityNotice,
          activityMemberHeader: item.activityMember.slice(0, 3),
          activityDetail: item.activityDetail,
          startTime: item.startTime,
          activityDescImg: item.activityDetail.activityDescImg.split(','),
          activityMember: item.activityMember,
          activityDescVideo: item.activityDetail.activityDescVideo,
          totalms: this.dateFormat(item.startTime) + 86400000 - new Date().getTime()
        })
        that.countDown()
        app.postRequest('/wx/consumer/record', 'POST', {
          consumerId: item.consumerId
        }, (ret) => {
          if (ret.data.success) {
            that.setData({
              user: ret.data.item
            })
          }
        })
        app.postRequest('/wx/cardRecord/countDay', 'POST', {
          consumerId: item.consumerId,
          activityId: e.acId
        }, (ret) => {
          if (ret.data.success) {
            that.setData({
              countDay: ret.data.item
            })
          }
        })
      }
    })

    this.getDateList();
    this.getCardRecordComment(e.acId);
  },

  onShow() {
    this.getCardRecordComment(this.data.acId);
  },
  getCardRecordComment(acid) {
    app.postRequest('/wx/cardRecord/record', 'POST', {
      consumerId: app.globalData.openid,
      activityId: acid
    }, (res) => {
      let _recommand = res.data.rows

      _recommand.map((item, index) => {
        let _item = item,
          _isZan = false
        _item.timeFormat = utils.formatTimeText(item.recordDate)
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
        return _item
      })

      this.setData({
        recommand: _recommand,
      })
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
    var that = this
    // 渲染倒计时时钟
    var clock = this.date_format(this.data.totalms)
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
    var second = Math.floor(micro / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = this.fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;

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
        url: '../clock/clock?acId=' + this.data.acId,
      })
    }

  },
  onShareAppMessage: function () { //分享
    return {
      title: "打卡", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/home/index',
      // path: '/pages/activity/activity?acId=' + this.data.acId,
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

  gotoHome () {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },

  gotoClassify () {
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
    let $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; //图片的真实宽高比例
    let viewWidth = 710, //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 710 / ratio; //计算的高度值
    this.setData({
      activityDescImgData: {
        width: viewWidth,
        height: viewHeight
      }
    })
  },

  onReady (e) {
    this.videoCtx = wx.createVideoContext('myVideo')
  },
  showVideo () {
    this.setData({
      isPlay: true
    })
    this.videoCtx.play()
  },
})