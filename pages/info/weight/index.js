const app = getApp()
Page({
  data: {
    weightList: [],
    page: 1,
    size: 20,
    loading: false,
    loadingComplete: false
  },

  onLoad() {
    this.getWeightList();
  },

  getWeightList() {
    let that = this;
    app.postRequest('/wx/card/weight/weight', 'POST', {
      consumerId: app.globalData.openid,
      page: that.data.page,
      size: that.data.size
    }, (res) => {
      let _weight = res.data.rows;
      _weight.map((item, index) => {
        let _item = item;
        _item.recordDate = _item.recordDate.substring(0, 10)
        _item.recordWeight = Number(_item.recordWeight);
        _item.recordWaist = Number(_item.recordWaist);
        _item.recordFat = Number(_item.recordFat);
        return _item;
      });

      that.setData({
        weightList: res.data.rows
      })
      if (res.data.rows.length < this.data.size) {
        that.setData({
          loadingComplete: true,
        })
      }
    })
  }
})