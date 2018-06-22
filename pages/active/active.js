var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: app.constant.base_pic_url + '/',
    activeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    // 每次页面显示刷新挑战列表数据
    this.methods.getActiveList(this);
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
    // 刷新挑战列表数据
    this.methods.getActiveList(this);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 分享
   */
  onShareAppMessage: function () {
    var club = wx.getStorageSync('club');
    return {
      title: club.name + '的活动',
      path: 'pages/active/active'
    }
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 获取挑战列表
     */
    getActiveList: (obj) => {
      // 请求服务器挑战数据
      wx.request({
        url: app.request_url + 'findActiveAndDetailByClub.asp',
        data: {
          clubId: wx.getStorageSync('clubId')
        },
        success: (active_res) => {
          wx.request({
            url: app.request_url + 'getPriceActive.asp',
            data: {
              json: encodeURI(JSON.stringify({ clubId: wx.getStorageSync('clubId')}))
            }, 
            success: function (res) {
              obj.setData({
                activeList: active_res.data.activeList,
                priceActiveList: res.data.priceActiveList
              });
            }
          });
        }
      });
    }
  },

  /**
   * wxml绑定函数: 活动列表点击绑定
   */
  activeDetail : function (e) {
    // 先检查是否登录
    if (!wx.getStorageSync('memberId')){
      wx.reLaunch({
        url: '../mine/mine?source=active'
      });
      return;
    }
    // 获取挑战数据跳转到挑战页面
    let index = e.currentTarget.dataset.index;
    let active_data = encodeURI(JSON.stringify(this.data.activeList[index]));
    wx.navigateTo({
      url: `../activeDetail/activeDetail?active=${active_data}`
    });
  },

  /**
   * wxml绑定函数: 砍价列表点击绑定
   */
  cutdown: function (e) {
    // 先检查是否登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=active'
      });
      return;
    }
    // 获取挑战数据跳转到挑战页面
    let index = e.currentTarget.dataset.index;
    let priceActive = this.data.priceActiveList[index];
    wx.navigateTo({
      url: '../priceCutdown/priceCutdown?priceActiveId=' + priceActive.id
    });
  }
})