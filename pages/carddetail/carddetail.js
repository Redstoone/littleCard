// pages/carddetail/carddetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      { name: '活动名称', place: '输入活动标题', isInp: true, value:'' },
      { name: '活动名称', place: '输入活动标题', isInp: false, value: '' },
      { name: '活动名称', place: '输入活动标题', isInp: false, value: '' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  txtChange(e){
    console.log(e)
  }
})