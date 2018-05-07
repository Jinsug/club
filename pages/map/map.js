Page({

  /**
   * 页面的初始数据
   */
  data: {
    club: {},
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var club = JSON.parse(decodeURI(options.club));
    //console.log(club);
    // 设置当前页面标题
    wx.setNavigationBarTitle({
      title: club.name
    });
    this.setData({
      club: club,
      markers: [
        {
          id: 0,
          latitude: club.latitude,
          longitude: club.longitude,
          callout: {
            display: 'ALWAYS',
            content: club.name,
            color: '#00000',
            bgColor: '#FFFFFF',
            padding: 2
          }
        }
      ]
    });
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
    
  }
})