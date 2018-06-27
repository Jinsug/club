var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: app.constant.base_pic_url,
    signList: []
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
    // 每次页面显示重新刷新我的足迹数据
    this.methods.myFooter(this);
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
   * 自定义方法
   */
  methods: {
    /**
     * 签到数据过滤
     */
    signFilter: (sign) => {
      // 处理签到日期
      let signDates = sign.signDate.split("-");
      let year = signDates[0];
      let month = signDates[1];
      let date = signDates[2];
      let monthTextList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
      sign.year = year;
      sign.month = month;
      sign.monthText = monthTextList[parseInt(month) - 1];
      sign.date = date;
      // 处理签到评分
      if (sign.deviceScore){
        sign.deviceScore = parseInt(sign.deviceScore) / 20;
      }
      if (sign.evenScore){
        sign.evenScore = parseInt(sign.evenScore) / 20;
      }
      if (sign.servieScore){
        sign.servieScore = parseInt(sign.servieScore) / 20;
      }
      return sign;
    },
    /**
     * 请求服务端我的足迹(签到)数据
     */
    myFooter: (obj) => {
      wx.request({
        url: app.request_url + 'myFooter.asp',
        data: {
          memberId: wx.getStorageSync('memberId'),
          clubId: wx.getStorageSync('clubId'),
        },
        success: (res) => {
          obj.setData({
            signList: res.data.signList.map(obj.methods.signFilter)
          });
        }
      });
    }
  },
  /**
   * wxml绑定方法: 签到列表点击绑定
   */
  bindTapSignItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let signId = this.data.signList[index].id;
    wx.navigateTo({
      url: `../memberEvaluate/memberEvaluate?signId=${signId}`
    });
  }
})