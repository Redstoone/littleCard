Page({
  data: {
    zanList: [],
    selectedId: 0,
    headicon: 'https://t10.baidu.com/it/u=3788365272,318725089&fm=173&app=25&f=JPEG?w=640&h=363&s=361016CC28B3EA475C13653D0300505A',
    recommand: [
      {
        id: 1,
        pic: '/images/index/card_pic.png',
        nick_name: '心潜',
        time: '1分钟前',
        days: '22',
        remark: '坚持锻炼身体',
        item_pic: '/images/index/card_pic.png',
        card_pic: '/images/index/card_pic.png',
        card_title: '户外锻炼',
        card_num: 7650
      }, {
        id: 2,
        pic: '/images/index/card_pic.png',
        nick_name: '历史',
        time: '5分钟前',
        days: '100',
        remark: '坚持锻炼身体',
        item_pic: '/images/index/card_pic.png',
        card_pic: '/images/index/card_pic.png',
        card_title: '户外锻炼',
        card_num: 7650
      }
    ]
  },

  changeTab(e) {
    this.setData({
      selectedId: e.currentTarget.dataset.idx
    })
  }
})