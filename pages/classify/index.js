const app = getApp()

Page({
  data: {
    classifyList: [],
    activityList: [],
    classifyActive: '',
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
      classifyActive: e.target.dataset.idx,
      categoryId: e.target.dataset.cid
    })
    this.getActivityList(e.target.dataset.cid)
  },

  // 获取活动分类
  getActivityCategoryList () {
    app.postRequest('/wx/category/record', 'POST', '', (res) => {
      if (res.data.success && res.data.item.length > 0) {
        this.setData({
          classifyList: res.data.item,
          // categoryId: res.data.item[0].id
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
        this.setData({
          activityList: res.data.rows
        })
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
          that.setData({
            activityList: that.data.activityList.concat(res.data.rows),
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
  bindVeiwActivity (e) {
    wx.navigateTo({
      url: '../lookdetail/lookdetail?acId=' + e.currentTarget.dataset.id,
    })
  },
})
