
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    base_img_url: 'https://www.ecartoon.com.cn/miniProgram/coach/img',
    userInfo: {},
    product: {
      image: 'opacity.png'
    },
    price: 0,
    phoneNumber: 0,
    showPhoneNubmer: '请点击获取手机号',
    ticket: { name: '请选择优惠券'},
    need: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = this;
    let param = JSON.parse(decodeURI(options.product));
    obj.setData({
      product: param,
      price: param.productPrice
    });
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
    // 如果有优惠券就显示优惠券并计算价格
    if (wx.getStorageSync("ticket")){
      let ticket = wx.getStorageSync("ticket");
      let price = this.data.product.productPrice - ticket.price;
      price = price < 0 ? 0 : price;
      this.setData({
        ticket: ticket,
        price: price
      });
      wx.removeStorageSync("ticket");
    }
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
   * 用户点击获取手机号
   */
  getPhoneNumber: function(e) {
    wx.showLoading({
      mask: 'true'
    });
    let obj = this;
    e.session_key = wx.getStorageSync("session_key");
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!decodePhoneNumber.asp',
      data: {
        json: JSON.stringify(e)
      },
      success: function (res) {
        // 获取和处理用户手机号
        let userPhoneNumber = res.data.phoneNumber;
        let showUserPhoneNumber = userPhoneNumber.substring(0, 3) + "****" 
          + userPhoneNumber.substring(userPhoneNumber.length - 4, userPhoneNumber.length);
        // 更新UI显示
        obj.setData({
          phoneNumber: userPhoneNumber,
          showPhoneNubmer: showUserPhoneNumber
        });
        // 隐藏加载动画
        wx.hideLoading();
      }
    })
  },
  /**
   * 用户点击选择优惠券
   */
  selectTicket: function() {
    let product = this.data.product;
    wx.navigateTo({
      url: `../ticket/ticket?productId=${product.productId}&productType=${product.productType}`
    });
  },
  /**
   * 用户点击确认支付
   */
  payMent: function() {
    let obj = this;
    // 判断用户是否已经获取手机号
    if (this.data.phoneNumber == 0){
      wx.showToast({
        title: '请先获取手机号!',
        icon: 'none'
      });
      return;
    }
    // 请求服务端签名
    let param = {}
    param.productId = this.data.product.productId;
    param.productType = this.data.product.productType;
    param.phoneNumber = this.data.phoneNumber;
    param.strengthDate = this.data.product.time;
    param.memberId = wx.getStorageSync("memberId");
    param.openId = wx.getStorageSync("openId");
    if(this.data.product.weight){
      param.weight = this.data.product.weight;
    }
    if(this.data.ticket){
      param.ticket = this.data.ticket.ticketId;
    }
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!createClubMPOrder.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function(sign){
        // console.log(sign);
        // 调用微信支付接口
        wx.requestPayment({
          timeStamp: sign.data.timeStamp,
          nonceStr: sign.data.nonceStr,
          package: sign.data.packageValue,
          signType: sign.data.signType,
          paySign: sign.data.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功!',
              icon: 'success'
            });
            // 支付成功, 跳转页面
            wx.navigateTo({
              url: `../paySuccess/paySuccess?productName=${obj.data.product.productName}`
            });
          },
          fail: function (e) {
            console.log(e);
          }
        });
      }
    });
  }
})