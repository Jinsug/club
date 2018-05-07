Page({

  /**
   * 页面的初始数据
   */
  data: {
       course:{
           // 给一个默认图，以免第一次渲染没有找到图片，而报404错误  
           image:"1.jpg"
       }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var objx = this;

     // 取出上一页面存储的course
     var course = wx.getStorageSync("course");
     objx.setData({
         course:course
     })    
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
   * 预约课程
   */
  appointment: function () {
      var objx = this;
      var courseId = objx.data.course.id;
      var memberId=  wx.getStorageSync("memberId");
      var param = {};
      param.courseId = courseId;
      // 会员从团体课表中预约 type = 2
      param.type = 2;
      param.memberId = memberId;

      // 发送预约请求
      wx.request({
        url: "https://www.ecartoon.com.cn/clubmp!appointment.asp",
        dataType:JSON,
        data:{
            json:encodeURI(JSON.stringify(param))
        },
        success: function (res) {
          res = JSON.parse(res.data);
          if (res.success) {
             // 预约发送成功，等待俱乐部审批
             wx.showModal({
               title: "提示",
               content: "您的预约申请发送成功，请等候俱乐部审批",
             })
             // 跳转到"我的预约"中
          } else {
             wx.showModal({
               title: "提示",
               content: res.message,
             })
          }
        }
      })


  }



})