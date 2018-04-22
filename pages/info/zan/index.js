const app = getApp();
Page({
  data: {
    zanList: []
  },

  onLoad () {
    this.getZanList();
  },

  getZanList () {
    app.postRequest('/wx/cardRecordPraise/record', 'POST', { consumerId: app.globalData.openid }, (res) => {
      let _zanList = res.data.rows

      _zanList = _zanList.map((item, index) => {
        let _item = item
        if (_item.cardRecord.recordDescImg){
          _item.recordImg = _item.cardRecord.recordDescImg.split(',')[0]
        }
        return _item
      })
      this.setData({
        zanList: _zanList
      })
    })
  }
})