// pages/carddetail/carddetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      { name: '活动名称', place: '输入活动标题', isInp: true, value:'',id:0,txtnum:0},
      { name: '活动名称', place: '输入活动标题', isInp: false, value: '', id: 1, txtnum: 0},
      { name: '活动名称', place: '输入活动标题', isInp: false, value: '', id: 2, txtnum: 0},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  txtChange(e){
    var that = this
    var idx = Number(e.currentTarget.dataset.index);
    if (idx == 0){
      that.setData({
        'list[0].txtnum': e.detail.value.length
      })           
    }
    if (idx == 1) {
      that.setData({
        'list[1].txtnum': e.detail.value.length
      })
    }
    if (idx == 2) {
      that.setData({
        'list[2].txtnum': e.detail.value.length
      })
    }   
  }
})