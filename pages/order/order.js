let util = require('../../utils/util.js');
let app = getApp();
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
    showPhoneNumber: '请点击获取手机号',
    ticket: { name: '请选择优惠券' },
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
    let showTicket = true;
    if (param.showTicket){
        showTicket = false;
    }

    obj.setData({
      showTicket: showTicket
    })

    // 查询用户信息
    obj.getMemberData();
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
    console.log('ticket:' + wx.getStorageSync('ticket'));
    if (wx.getStorageSync("ticket") && wx.getStorageSync('ticket') != '' 
      && !this.data.product.shareMember){
      let ticket = wx.getStorageSync("ticket");
      let price = this.data.product.productPrice - ticket.price;
      price = price < 0 ? 0 : price;
      this.setData({
        ticket: ticket,
        price: price
      });
      wx.removeStorageSync("ticket");
    } else if (!wx.getStorageSync('ticket') && wx.getStorageSync('ticket') == '' &&  
        this.data.product.shareMember) {
      // 如果是通过分享进入需要再打九折
      var price = this.data.product.productPrice * 0.9;
      this.setData({
        price: price
      });
    } else if (wx.getStorageSync('ticket') && wx.getStorageSync('ticket') != '') {
      var ticket = wx.getStorageSync('ticket');
      var price = (this.data.product.productPrice - ticket.price) * 0.9;
      price = price < 0 ? 0 : price;
      this.setData({
        ticket: ticket,
        price: price
      });
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
   * 从后台获取用户手机号等信息
   */
  getMemberData: function () {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    var param = {};
    param.memberId = memberId;
    
    // 请求后台数据
    wx.request({
      url: app.request_url + 'findMe.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        if (res.success) {
          // 数据请求成功
          var mobilephone = res.memberData.mobilephone;
          var mobilevalid = res.memberData.mobileValid;
          if (mobilephone && mobilephone != "" && mobilephone != "null" && mobilephone!= "undefined" && mobilevalid && mobilevalid != "" && mobilevalid != "null" && mobilevalid != "undefined") {
            if (parseInt(mobilevalid) == 1) {
              let showUserPhoneNumber = mobilephone.substring(0, 3) + "****"
                + mobilephone.substring(mobilephone.length - 4, mobilephone.length);
              // 手机验证通过，此时不需验证
              objx.setData({
                phoneNumber: mobilephone,
                showPhoneNumber: showUserPhoneNumber
              })

            }
          }
        } else {
          // 程序异常
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel:false
          })
        }
      },
      error: function (e) {
        // 网络请求失败
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel:false
        })
      }
    })
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
      url: app.request_url + 'decodePhoneNumber.asp',
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
          showPhoneNumber: showUserPhoneNumber
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
    param.price = this.data.price;
    param.memberId = wx.getStorageSync("memberId");
    param.openId = wx.getStorageSync("openId");
    if(this.data.product.weight){
      param.weight = this.data.product.weight;
    }
    if(this.data.product.shareMember){
      param.shareMember = this.data.product.shareMember;
    } 
    if(this.data.ticket){
      param.ticket = this.data.ticket.ticketId;
    } 
    if (this.data.product.priceId) {
      param.priceId = this.data.product.priceId;
    }
    wx.request({
      url: app.request_url + 'createClubMPOrder.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function(sign){
         console.log(sign);
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