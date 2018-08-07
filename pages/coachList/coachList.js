var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_pic_url: app.constant.base_pic_url
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    obj.getCoachList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 获取教练数据
   */
  getCoachList: function () {
    var obj = this;
    var coachList = [];
    // 请求服务器
    wx.request({
      url: app.request_url + 'getCoachListByClub.asp',
      data: {},
      dataType: JSON,
      success: function (res) {
        // 请求过程，成功
        res = JSON.parse(res.data);
        if (res.success) {
          // 数据请求成功
          var hasData = 0;
          if (res.coachList.length > 0) {
            hasData = 1;
          }
          obj.setData({
            coachList: res.coachList,
            hasData: hasData
          })
        } else {
          // 程序异常，数据请求失败
          console.log('程序异常，原因: ' + res.message);
        }
      },
      fail: function (e) {
        // 请求过程失败
        console.log('网络异常： ' + JSON.stringify(e));
      }
    })
    
   
  },


  /**
   * 跳转教练详情页
   */
  coachDetail: function (e) {
    var memberId = wx.getStorageSync('memberId');
    if (!memberId || memberId == '' || memberId == 'null') {
      wx.reLaunch({
        url: '../../pages/mine/mine?source=coachList',
      })
      return;
    }

    var coachid = e.currentTarget.dataset.coachid;
    // 跳转到教练主页去
    wx.navigateTo({
      url: '../../pages/coachDetail/coachDetail?coachId=' + coachid,
    })
    
  }
})