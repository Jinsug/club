Page({

  /**
   * 页面的初始数据
   */
  data: {
    dou_dates: ["preDate", "preDate", "preDate", "preDate", "preDate", "preDate","preDate"]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var toDate = new Date();
    var mm = toDate.getMonth() + 1;
    var dd = toDate.getDate();
    if ( mm < 10 ) {
        mm = "0" + mm;
    }
    if ( dd < 10 ) {
        dd = "0" + dd;
    }
    var toDay = toDate.getFullYear() + "-" + mm + "-" + dd;
    this.getDates(toDay);
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
   * JS获取当前周从星期一到星期天的日期
   */
  getDates: function (currentTime) {
    var objx = this;
    var currentDate = new Date(currentTime);
    var timesStamp = currentDate.getTime();
    var currenDay = currentDate.getDay();
    var dates = [];
    for(var i = 0; i< 7; i++) {
      var dou_date = new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7));
      var MM = dou_date.getMonth() + 1;
      var dd = dou_date.getDate();
      if ( MM < 10 ) {
         MM = "0" + MM;
      }
      if ( dd < 10 ) {
        dd = "0" + dd;
      }
  var param = {};
  var preDate = dou_date.getFullYear() + "-" + MM + "-" + dd;
  param.date = preDate;
  param.index = i;
  // 判断是不是今天
  if ( currentTime == param.date ) {
    param.index = "今天"
  }
  dates.push(param);
}
  // 将获取到的本周的数据存起来
  objx.setData({
      currentWeek:dates
  })

},

/**
 * 用户选择日期后，将当天的数据查询出来
 */
getChooseDayData: function (date) {
    var objx = this;
    // 获取当前选中的日期
    var chooseDate = date.currentTarget.dataset.choosedate;

    // 获取但当前选中日期的下标
    var chooseIndex = date.currentTarget.dataset.chooseindex;
    
    // 将数据复原
    var objx_dates = objx.data.dou_dates;
    for(var i = 0; i < 7; i++) {
       objx_dates[i] = "preDate";
    }

    if (chooseIndex != "今天" && chooseIndex != "undefined") {
      objx_dates[chooseIndex] = "preDate chooseDate";
    }
    
    // 设值
    objx.setData({
       dou_dates:objx_dates
    })




}


})