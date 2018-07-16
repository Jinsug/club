var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    liveList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
    var source = options.source;
    if (source) {
      objx.setData({
        source:source
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 查询直播列表
    this.methods.getLiveList(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 查询直播列表
    this.methods.getLiveList(this);
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 分享页面
   */
  onShareAppMessage: function () {
    var objx = this;
    var club = wx.getStorageSync('club');
    return {
      title: '健身中国微讲堂——视频直播各种健身讲座',
      path: 'pages/live/live?source=share'
    }
  },

  /**
   * wxml绑定函数:直播列表点击绑定(去详情页面)
   */
  liveDetail: function (e) {
    // 检查登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=live'
      });
      return;
    }
    wx.removeStorageSync('payLive');
    var index = e.currentTarget.dataset.index;
    var live = this.data.liveList[index];
    wx.navigateTo({
      url: '../liveShare/liveShare?live=' + encodeURI(JSON.stringify(live))
    })
  },

  /**
   * wxml绑定函数:发起按钮点击绑定(到发起直播页面)
   */
  releaseLive: function () {
    // 检查登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=live'
      });
      return;
    }
    wx.navigateTo({
      url: '../releaseLive/releaseLive'
    });
  },
  
  /**
  * wxml绑定函数:主页按钮点击绑定(回到主页)
  */
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },

  /**
   * 自定义函数
   */
  methods: {
    // 查询直播列表
    getLiveList: function (obj) {
      wx.request({
        url: app.request_url + 'liveList.asp',
        success: function (res) {
          obj.setData({
            liveList: res.data.items
          });
        }
      });
    }
  }
})