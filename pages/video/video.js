Page({

  /**
   * 页面的初始数据
   */
  data: {
    club: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      club: wx.getStorageSync('club')
    });

    var source = options.source;
    if (source) {
      this.setData({
        source: source
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
   * 分享页面
   */
  onShareAppMessage: function () {
    var objx = this;
    var club = wx.getStorageSync('club');
    return {
      title: club.name + '视频介绍',
      path: 'pages/video/video?source=share'
    }
  },
  
 /**
  * wxml绑定函数:主页按钮点击绑定(回到主页)
  */
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  }
})