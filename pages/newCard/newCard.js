// pages/newCard/newCard.js
Page({
  data: {
    items: [
      {id:1, value: '1', text: '不限日期，长期打卡', checked: true },
      {id:2, value: '2', text: '指定开始结束日期', checked: false }
    ]
  },
  radioChange: function (e) {
    console.log(e)
    var that = this;
    var items =[];
    for (var i = 0; i < that.data.items.length;i++){
      var item = that.data.items[i]
      item.checked = false  
      if (e.detail.value && e.detail.value === that.data.items[i].value){
        item.checked =true        
      }
      items.push(item)
    }
    that.setData({
      items:items
    })
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  }
})