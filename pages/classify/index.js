const app = getApp()

Page({
  data: {
    classifyList: [
      {
        cId: 0,
        name: '全部'
      },
      {
        cId: 0,
        name: '阅读'
      }
      ,
      {
        cId: 0,
        name: '外语'
      },
      {
        cId: 0,
        name: '亲子'
      },
      {
        cId: 0,
        name: '技能'
      },
      {
        name: '习惯'
      },
      {
        cId: 0,
        name: '运动'
      },
      {
        cId: 0,
        name: '艺术'
      }
    ],
    classifyActive: 0,
    activityList: [{
      id: 1234,
      img: 'https://t11.baidu.com/it/u=741657904,1441720405&fm=173&app=12&f=JPEG?w=640&h=426&s=1B304980F4A718AC232588920300C0B3',
      name: '红烧牛肉',
      desc: '每天一课，从零开始学习钢琴',
      accout: 10733,
      num: 54223
    }]
  },
  onLoad: function () {
    // this.getActivityList();
  },

  // 切换分类
  bindClassifyClick (e) {
    let _idx = e.target.dataset.idx;
    let _item = e.target.dataset.item;
    this.setData({
      classifyActive: e.target.dataset.idx
    })
  },

  // 获取活动列表
  getActivityList () {

  },

  // 跳转活动详情页面
  bindVeiwActivity () {

  }


})
