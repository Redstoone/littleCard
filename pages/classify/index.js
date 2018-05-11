const app = getApp()

Page({
  data: {
    classifyList: [{
      id: 0,
      name: '推荐'
    }],
    activityList: [],
    classifyActive: 0,
    categoryId: '',
    page: 1,
    size: 5,
    loading: false,
    loadingComplete: false
  },
  onLoad: function () {
    this.getActivityCategoryList();
  },
  
  // 切换分类
  bindClassifyClick (e) {
    let _idx = e.target.dataset.idx
    this.setData({
      page: 1,
      classifyActive: _idx,
      categoryId: _idx ? e.target.dataset.cid : ''
    })
    this.getActivityList(this.data.categoryId)
  },

  // 获取活动分类
  getActivityCategoryList () {
    app.postRequest('/wx/category/record', 'POST', '', (res) => {
      if (res.data.success && res.data.item.length > 0) {
        this.setData({
          classifyList: this.data.classifyList.concat(res.data.item),
        })
        this.getActivityList()
      }
    })
  },

  onShow() {
    this.setData({
      page: 1,
      activityList: []
    })
    this.getActivityList(this.data.categoryId)
  },

  // 获取活动列表
  getActivityList(categoryId = null) {
    let _data = {
      page: this.data.page,
      size: this.data.size
    }
    if (categoryId){
      _data.categoryId = categoryId
    }
    app.postRequest('/wx/activity/activitys', 'POST', _data, (res) => {
      if (res.data.success) {
        let cardList = res.data.rows
        cardList = cardList.map((item, index) => {
          let _item = item;
          if (_item.timeType == 20) {
            _item.startDate = _item.startTime.substring(5, 10);
            _item.overDate = _item.overTime.substring(5, 10);
          }
          return _item
        })

        this.setData({
          activityList: cardList
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (!that.data.loadingComplete) {
      that.setData({
        page: that.data.page + 1,
        loading: true
      });
      let _data = {
        page: that.data.page,
        size: that.data.size
      }
      if (that.data.categoryId) {
        _data.categoryId = that.data.categoryId
      }
      app.postRequest('/wx/activity/activitys', 'POST', _data, (res) => {
        if (res.data.success) {
          let cardList = res.data.rows
          cardList = cardList.map((item, index) => {
            let _item = item;
            if (_item.timeType == 20) {
              _item.startDate = _item.startTime.substring(5, 10);
              _item.overDate = _item.overTime.substring(5, 10);
            }
            return _item
          })
          that.setData({
            activityList: that.data.activityList.concat(cardList),
            loading: false
          })
          if (res.data.rows.length < this.data.size) {
            that.setData({
              loadingComplete: true,
            })
          }
        }
      })
    }
  },

  // 跳转活动详情页面
  // 第二次打开无需进入打卡详情页直接进入打卡页面
  bindVeiwActivity (e) {
    let acId = e.currentTarget.dataset.id;
    let that = this;
    app.postRequest('/wx/activity/member/hasJoin', 'POST', {
      activityId: acId,
      consumerId: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        wx.navigateTo({
          url: '../activity/activity?acId=' + acId,
        })
      } else {
        wx.navigateTo({
          url: '../lookdetail/lookdetail?acId=' + acId,
        })
      }
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    
    this.setData({
      page: 1,
      activityList: [],
      classifyList: [{
        id: 0,
        name: '推荐'
      }],
    })
    this.getActivityCategoryList();
    this.getActivityList(this.data.categoryId)
  },
})
