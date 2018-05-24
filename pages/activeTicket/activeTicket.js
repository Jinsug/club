Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeCode:""
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
   * activeCode
   */
  activeCode: function (e) {
      this.setData({
          activeCode: e.detail.value
      })
  },
  
  /**
   * 用户点击激活按钮
   */
  active: function () {
      var obj = this;
      var activeCode = obj.data.activeCode;
      console.log(JSON.stringify(activeCode));

      // 判断用户是否输入了code
      if (activeCode == "") {
           wx.showModal({
             title: '提示',
             content: '请填写激活码!',
           })
           return;
      }

      // 用户输入ok, 调用后台接口，激活优惠券
      var param = {};
      var memberId = wx.getStorageSync("memberId");
      param.memberId = memberId;
      param.activeCode = activeCode;
      wx.request({
        url: 'https://www.ecartoon.com.cn/expertex!activeTicket.asp',
        data: {
           json:encodeURI(JSON.stringify(param))
        },
        success: function (res) {
            if (res.data.success) {
              // 激活成功
              wx.showToast({
                title: 'ok',
              })

              // 激活成功跳转优惠券列表
              wx.navigateBack({
                delta: 1
              })
            } else {
              // 激活异常，提示用户
              wx.showModal({
                title: '提示',
                content: res.data.message,
              })
              return;
            }
        }
      })

  }

})