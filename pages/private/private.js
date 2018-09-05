var app = getApp()
Page({
  data: {
    
  },

  /**
   * 页面载入函数
   */
  onLoad: function (options) {
    // 通过小程序码进入
    if (options.scene) {
      var param = decodeURIComponent(options.scene);
      // 通过百度手机广告小程序码进入, 保存originType
      if (param == 'expert_baidu_mobile') {
        app.constants.originType = param;
      }
      // 通过百度PC广告小程序码进入, 保存originType
      if (param == 'expert_baidu_PC') {
        app.constants.originType = param;
      }
      // 普通小程序码, 保存用户Id
      app.constants.shareMember = param;
    }

    // 通过小程序转发进入, 保存分享用户Id
    if (options.shareMember) {
      app.constants.shareMember = options.shareMember;
    }  

    // 页面初始化, 读取服务端专家系统数据
    this.methods.init(this);
  },

  /**
   * 页面显示函数
   */
  onShow: function () {

  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '国家健身队主教练王严多年研究成果，量身定制增肌减脂健身计划，'
      + '快速达成目标！新用户领30元礼券',
      desc: '',
      imageUrl: 'https://www.ecartoon.com.cn/picture/201806280920.jpg',
      path: 'pages/index/index'
    }
  },

  // wxml绑定函数:我要定制点击绑定
  bindToSettingButtonTap: function (e) {
    // 判断用户是否登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=index'
      })
      return;
    }
    // 到填写用户身体数据页面
    wx.navigateTo({
      url: '../qrcode/qrcode'
    })
  },

  /**
   * 自定义函数
   */
  methods: {
    // 页面初始化
    init: function (obj) {
      wx.request({
        url: 'https://www.ecartoon.com.cn/expertex!loadPlan.asp',
        success: function (res) {
          obj.setData({
            item: res.data.item
          });
        }
      });
    }
  }
})
