let util = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: app.constant.base_pic_url,
    active: {
      image: 'opacity.png'
    },
    currentDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let active = JSON.parse(decodeURI(options.active));
    let currentDate = util.formatTime(new Date());
    this.setData({
      active: active,
      currentDate: currentDate
    });
  },

  // 用户选择改变日期
  changeDate: function (e) {
    this.setData({
      currentDate: e.detail.value
    });
  },

  // 获取用户输入的值
  getInputValue: function (e) {
    this.setData({
      weight: e.detail.value
    });
  },

  // 检查用户是否输入体重数据
  checkInputValue: function () {
    if(this.data.weight){
      return true;
    } else {
      wx.showToast({
        title: '请先输入体重！',
        icon: 'none',
        complete: () => {
          return false;
        }
      });
    }
  },

  // 去支付
  goBuy: function () {
    let objx = this;
    let target = objx.data.active.target;
    // 体重挑战时，检查是否输入体重
    if (target == 'A' || target == 'B') {
        if(!this.checkInputValue()){
          return;
        }
    }
    // 组合参数传至订单页面
    let active = this.data.active;
    let param = {
      productId: active.id,
      productName: active.name,
      productPrice: active.amerce_money,
      image: active.image,
      productType: 'active',
      time: this.data.currentDate,
      weight: this.data.weight
    }
    // url编码
    param = encodeURI(JSON.stringify(param));
    wx.navigateTo({
      url: `../order/order?product=${param}`
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
    
  }
})