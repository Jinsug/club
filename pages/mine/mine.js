Page({

  /**
   * 页面的初始数据
   */
  data: {
     memberData:{
        image:"1.jpg"
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var objx = this;
      objx.findMe();
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
   * 查询当前用户的数据
   */
  findMe:function () {
      var objx = this;
      var memberId = wx.getStorageSync("memberId");
      var param = {};
      param.memberId = memberId;

      // 发起网络请求
      wx.request({
        url: "https://www.ecartoon.com.cn/clubmp!findMe.asp",
        dataType:JSON,
        data:{
           json:encodeURI(JSON.stringify(param))
        },
        success: function (res) {
          // 请求成功
          res = JSON.parse(res.data);
          if (res.success) {
             // 获取数据成功
             objx.setData({
                memberData:res.memberData
             })
          } else {
            // 程序异常
            wx.showModal({
              title: "提示",
              content: res.message,
            })
          }
        },
        error: function (e) {
          // 请求失败
          wx.showModal({
            title: "提示",
            content: "网络异常",
          })
        }
      }) 
  },

  /**
   * 查看我的订单
   */
  gotoMyOrder: function () {
      wx.navigateTo({
        url: "../../pages/myOrder/myOrder",
      })
  },

  /**
   * 查看我的钱包
   */
  gotoMyWallet: function () {
    wx.navigateTo({
      url: "../../pages/myWallet/myWallet",
    })
  }
})