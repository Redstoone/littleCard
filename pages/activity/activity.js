// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    week:''

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
  onLoad: function () {
    this.getDateList();
  },
})