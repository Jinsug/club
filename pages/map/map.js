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
    var clubList = wx.getStorageSync('clubList');
    // 设置当前页面标题
    wx.setNavigationBarTitle({
      title: '门店分布'
    });
    // 添加地图标点
    this.methods.addMarkers(this, clubList);
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
   * 自定义函数
   */
  methods: {
    /**
     * 添加地图标点
     */
    addMarkers: (obj, clubList) => {
      // 设置地图标点
      var markers = [];
      clubList.forEach((club, i) => {
        var marker = {
          id: i,
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
        markers.push(marker);
      });
      // 渲染页面
      obj.setData({
        club: clubList[0],
        markers: markers
      });
    }
  }
})