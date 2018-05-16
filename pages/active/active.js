Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture/',
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
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
        url: 'https://www.ecartoon.com.cn/clubmp!findActiveAndDetailByClub.asp',
        data: {
          clubId: wx.getStorageSync('clubId')
        },
        success: (res) => {
          obj.setData({
            activeList: res.data.activeList
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
  }
})