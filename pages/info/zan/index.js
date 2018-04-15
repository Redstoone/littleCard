const app = getApp();
Page({
  data: {
    headicon: 'https://t10.baidu.com/it/u=3788365272,318725089&fm=173&app=25&f=JPEG?w=640&h=363&s=361016CC28B3EA475C13653D0300505A',
    zanList: []
  },

  onLoad () {
    this.getZanList();
  },

  getZanList () {
    app.postRequest('/wx/cardRecordPraise/record', 'POST', { consumerId: app.globalData.openid }, (res) => {
      this.setData({
        zanList: res.data.rows
      })
    })
  }
})