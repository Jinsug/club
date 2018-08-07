Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    projectList: [],
    certificateList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    if (wx.getStorageSync('coachDetail')) {
      var coachDetail = wx.getStorageSync('coachDetail');
      obj.setData({
        projectList: coachDetail.projectList,
        certificateList: coachDetail.certificateList
      });
    } else {
      wx.request({
        url: 'https://www.ecartoon.com.cn/coachmp!detail.asp',
        data: {
          id: wx.getStorageSync('coachId')
        },
        success: function (res) {
          // console.log(res);
          // wx.setStorageSync('coachDetail', res.data);
          obj.setData({
            projectList: res.data.projectList,
            certificateList: res.data.certificateList
          });
        }
      });
    }

    obj.getEquipmentWidth();
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
   * 获取设备高宽
   */
  getEquipmentWidth: function () {
     var objx = this;
     // 调用微信设备信息接口
     var res = wx.getSystemInfoSync();
     var windowWidth = res.windowWidth;
     var pictureDivWidth =  windowWidth * 0.28;
     var pictureDivHeight = windowWidth * 0.28 * 0.75;
     pictureDivWidth = pictureDivWidth.toFixed(0) + "px";
     pictureDivHeight = pictureDivHeight.toFixed(0) + "px";
     objx.setData({
       pictureDivWidth:pictureDivWidth,
       pictureDivHeight: pictureDivHeight
     })
  }
})