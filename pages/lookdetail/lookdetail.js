// pages/lookdetail/lookdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: '',
    cardClickNumber: '',
    name: '',
    acId: '',
    // activityThumb: '', //活动主图
    // mainDescription:'',	//群主描述
    // activityNotice:'',//	活动通知
    // mainWx:'',	//群主微信
    // activityDescription:''	//活动描述
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.postRequest('/wx/activity/singleAll', 'POST', {
      id: options.acId
    }, (res) => {
      if (res.data.success) {
        that.setData({
          activityDetail: res.data.item.activityDetail, //活动详情    
          cardClickNumber: res.data.item.cardClickNumber,
          name: res.data.item.name,
          acId: options.acId
        })
        app.postRequest('/wx/consumer/record', 'POST', {
          consumerId: res.data.item.consumerId
        }, (ret) => {
          if (ret.data.success) {
            that.setData({
              user: ret.data.item
            })
          }
        })
      }
    })
  },

  bindJoinActivity() {
    let that = this
    app.postRequest('/wx/activity/member/join', 'POST', {
      activityId: that.data.acId,
      consumerId: app.globalData.openid
    }, (res) => {
      if (res.data.success) {
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          duration: 1500,
          success: function () {
            wx.navigateTo({
              url: '../activity/activity?acId=' + that.data.acId,
            })
          }
        })
      } else {
        wx.showToast({
          title: '活动未开始',
          icon: 'loading',
          duration: 1500
        })
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})