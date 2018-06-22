var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 设置默认页
     currentTab:"0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
    // 获取页面高度
    objx.getEquipmentHeight();

    // 获取数据
    objx.getDatas();
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
     if (currentTab == objx.data.currentTab) {
       return false;
     } else {
       objx.setData({
         currentTab: currentTab
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
   * 获取设备高度
   */
  getEquipmentHeight: function () {
      var objx = this;
      var sysInfo = wx.getSystemInfoSync();
      var eqHeight = sysInfo.windowHeight + "px";
      objx.setData({
          eqHeight:eqHeight
      })
  },

  /**
   * 初始化数据
   */
  getDatas: function () {
     var objx = this;

     // 发起网络请求，获取收入、支出、提现记录、账户余额
     var param = {};
     var memberId = wx.getStorageSync("memberId");
    //  memberId = "9388";
     param.memberId = memberId;
     wx.request({
       url: app.request_url + 'myWallet.asp',
       dataType:JSON,
       data:{
          json:encodeURI(JSON.stringify(param))
       },
       success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        if (res.success) {
          // 获取数据成功，设置数据
          objx.setData({
            incomeList: res.incomeList,
            outList: res.outList,
            cashList: res.cashList,
            balance: res.balance
          })
        } else {
          // 程序异常，获取数据失败
          wx.showModal({
            title: '提示',
            content: res.message,
          })
        }
       },
       error: function (e) {
         // 网络请求失败
         wx.showModal({
           title: "提示",
           content: "网络异常",
         })
       }
     })

     
    
  },

  /**
   * 提现页面
   */
  gotoCash: function () {
    var objx = this;
    var cashMoney = objx.data.balance;
    wx.navigateTo({
      url: "../../pages/cash/cash"
    })
  }

})