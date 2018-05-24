Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentTab:"0",
      base_pic_url:"https://www.ecartoon.com.cn/picture"
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var objx = this;
      objx.getOrderData();
      objx.getEquipmentHeight();
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
  // onShareAppMessage: function () {
    
  // },

  /**
   * 点击切换
   */
  clickTab: function (e) {
     var objx = this;
     var currentTab = e.target.dataset.current;
     if (objx.data.currentTab == currentTab) {
         return false;
     } else {
         objx.setData({
             currentTab:currentTab
         })
     }
  },

  /**
   * 滑动切换
   */
  swiperTab: function (e) {
     var objx = this;
     objx.setData({
         currentTab:e.detail.current
     })
  },

  /**
   * 初始化订单数据
   */
  getOrderData: function () {
     var objx = this;
     var param = {};
     var memberId = wx.getStorageSync("memberId");
     param.memberId = memberId;
     // 发起网络请求，获取订单数据
     wx.request({
       url: "https://www.ecartoon.com.cn/clubmp!findOrders.asp",
       dataType:JSON,
       data:{
           json:encodeURI(JSON.stringify(param))
       },
       success:function (res) {
         // 请求成功
         res = JSON.parse(res.data);
         if (res.success) {
           // 成功返回数据
           objx.setData({
             orderList1: res.b,
             orderList0: res.a,
             orderList3: res.c
           })
         } else {
           // 程序异常，显示报错信息
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
   * 获取设备高度
   */
  getEquipmentHeight: function () {
     var objx = this;
     var sysInfo = wx.getSystemInfoSync();
     var eqHeight = sysInfo.windowHeight + "px";
     objx.setData({
          eqHeight:eqHeight
     })
  }

  

})