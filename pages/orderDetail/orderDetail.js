var app = getApp();
var obj = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_img_url: app.constant.base_img_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    obj = this;
    var orderId = options.orderId;
    obj.init(orderId);
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
   * 初始化页面数据
   */
  init: (orderId) => {
    var param = {
      orderId: orderId
    };

    // 请求后台数据
    wx.request({
      url: app.request_url + 'orderDetail.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: (res) => {
        if (res.data.success) {
          // 请求数据成功
          var order = res.data.orderDetail;
          var fitList = order.useRange ? order.useRange.split(',') : [];
          order.fitCount = fitList.length;
          var showCount = order.proType == 2 ? true : false;
          // 计算出勤率
          var rate = 0.0;
          var isHappy = false;
          var remindFont = "";
          if (order.startTime) {
            var totalDay = obj.DateDiff2Day(order.startTime);
            rate = parseFloat(order.signCount / totalDay);
            if (rate < parseFloat(1/3) ) {
              remindFont = '您的健身频率偏低，要坚持运动哦！';
            }

            if (rate >= parseFloat(1/3)) {
              remindFont = '您有很好的运动习惯，请继续保持！';
              isHappy = true;
            }
          } else {
            remindFont = '请尽快开始您的健身之旅！';
          }
          
          obj.setData({
            order: order,
            showCount: showCount,
            ishappy: isHappy,
            remindFont: remindFont,
            product: res.data.product
          });

        } else { 
          // 数据请求失败
          console.log('程序异常，原因： ' + res.data.message);
        }
      },
      fail: (e) => {
        console.log('网络异常！');
      }
    })
    
    
  },


   /**
    * 计算日期相减天数
    */
   DateDiff2Day: (sDate) =>{
    　　var sdate = new Date(sDate.replace(/-/g, "/"));
    　　var now = new Date();
    　　var days = now.getTime() - sdate.getTime();
    　　var day = parseInt(days / (1000 * 60 * 60 * 24));
    　　return day;
  },


  /**
   * 跳转适用店面
   */
  gotoClubList: () => {
    wx.setStorageSync('useRange', obj.data.order.useRange);
    wx.navigateTo({
      url: '../clubList/clubList'
    });
  },


  /**
   * 跳转到健身卡详情页面
   */
  gotoProduct: () => {
    // 传递下一个页面
    wx.setStorageSync('product', obj.data.product);
    wx.navigateTo({
      url: '../product/product'
    });
  }





})