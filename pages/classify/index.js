const app = getApp()

Page({
  data: {
    classifyList: [],
    activityList: [],
    classifyActive: 0,
    categoryId: null
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
      if (res.data.success) {
        this.setData({
          classifyList: res.data.item,
          categoryId: res.data.item[0].id
        })
        this.getActivityList(res.data.item[0].id)
      }
    })
  },

  // 获取活动列表
  getActivityList(categoryId) {
    app.postRequest('/wx/activity/activitys', 'POST', { categoryId, categoryId }, (res) => {
      console.log(res)
      if (res.data.success) {
        this.setData({
          activityList: res.data.rows
        })
      }
    })
  },

  // 跳转活动详情页面
  bindVeiwActivity () {

  }


})
