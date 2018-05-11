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
    let obj = this;
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
  // 检查登录状态 
  checkLoginState: function () {
    if (!wx.getStorageSync('memberId')) {
      wx.showModal({
        title: '提示',
        content: '您取消了授权，需要在“发现”的小程序页面将“俱乐部小程序”删除，' +
        '重新登录授权才可以体验后续功能',
        showCancel: false,
        success: () => {
          return false;
        }
      });
    } else {
      return true;
    }
  },
  // 查看挑战详情
  activeDetail : function (e) {
    // 先检查是否登录
    if (!this.checkLoginState()){
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