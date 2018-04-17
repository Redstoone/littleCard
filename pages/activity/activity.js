// pages/activity/activity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    week:'',
    name: "",//活动名称
    mainWx: "",//群主微信
    memberNumber: "",//参加人数
    cardClickNumber:"", //打卡次数
    activityNotice:'',//公告
    headicon:'',//头像
    nickname: '',//昵称
    totalms:'',//时间
    clock:'',
    startTime:'',
    isClick:false,//打卡状态
  },
    getWeek:function(week){
    if (week>=0&&week<7){
      switch(week){
        case 0:{
          return "周日";
        }
        case 1: {
          return "周一";
        }
        case 2: {
          return "周二";
        }
        case 3: {
          return "周三";
        }
        case 4: {
          return "周四";
        }
        case 5: {
          return "周五";
        }
        case 6: {
          return "周六";
        }
      }
    }
  },
  getDateList: function () {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var week = time.getDay();
    var today = month + "/" + day;
    //当月天数
    var count = new Date(year, month, 0).getDate();
    var list = [];
    var newList = [[]];
    for (var i = 0; i < 7; i++) {
      var _week = (week + i) % 7;//星期
      var str = (i == 0 ? "今天" : (i == 1 ? "明天" : (i == 2 ? "后天" : this.getWeek(_week))));
      var _month = month + parseInt((day + i) / count);//月份
      var _count = new Date(year, (month + 1), 0).getDate();//当月天数
      var _day = 0;
      if ((day + i >= count + _count) || parseInt((day + i) / count) == 2) {
        _month = month + 1 + parseInt((day + i - count) / _count);
        _day = (day + i - count) % _count;
      } else {
        _day = (day + i) % count;//日期
        _count = 0;
      }
      if (_day == 0) {
        _month -= 1;
        _day = _count || count;
      }
      if (_month - month != newList.length - 1) {
        newList.push([]);
      }
      newList[_month - month].push({ str: str.replace(/周[\s|\S]$/, ''), year: year, month: _month, week: _week, day: (_day < 10 ? "0" : "") + _day, isDate: true });
    }
    console.log(newList)
    newList[0][0].day = "今天"
    this.setData({
      week: week,
      years: newList
    })
  },
  clickChecked(e){
    console.log(e)
  },
  onLoad: function (e) {
    var that =this
    console.log(e.acId)

    app.postRequest('/wx/activity/singleAll','POST', {
      id: e.acId
    }, (res) => {
      if (res.data.success) {
          var item = res.data.item
        that.setData({
          name: item.name,
          mainWx: item.mainWx,
          memberNumber: item.memberNumber,
          cardClickNumber: item.cardClickNumber,
          activityNotice: item.activityDetail.activityNotice,
          startTime: item.startTime,
          totalms:this.dateFormat(item.startTime) + 86400000 - new Date().getTime()
        })
        that.countDown()
        app.postRequest('/wx/consumer/record', 'POST', {
          //consumerId: item.consumerId
           consumerId: "1"
        }, (res) => {
          if (res.data.success) {
            console.log(res)
            that.setData({
              headicon: res.data.item.headicon,
              nickname: res.data.item.nickname
            
            })
          }
        })


      }
    })

      
    this.getDateList();
  },
  set(){
    wx.redirectTo({
      url: '/pages/info/setting/index',
    })
  },
  dateFormat(time) {//时间转换
    return new Date(time).getTime()
  },
  countDown() {
    var that = this
    //				// 渲染倒计时时钟
    var clock = this.date_format(this.data.totalms)
    that.setData({
      clock :clock
    })
    console.log(clock,"clock")
    if (this.data.totalms <= 0) {
      that.setData({
        clock: "点击打卡",
        isClick:true
      })
      // timeout则跳出递归
      return;
    }
    setTimeout(() => {
      // 放在最后--
      that.setData({
        totalms:this.dateFormat(that.data.startTime) + 86400000 - new Date().getTime()
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
      return '00'+':'+min + ":" + sec
    }
  },
  // 位数不足补零
  fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
  },


  clickCard(){//点击打卡
    if (this.data.isClick){//为true倒计时结束  可以跳转
      wx.navigateTo({
        url: '../clock/clock',
      })
    }
    
  }
  
})