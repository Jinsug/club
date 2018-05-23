var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    product: {
      image1: 'opacity.png'
    },
    clubCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let product = wx.getStorageSync('product');
    let clubCount = product.useRange.split(",").length;
    // 设置日历的日期选择区间
    let start = util.formatTime(new Date());
    let end = util.formatTime(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)));
    // 获取当前系统时间
    product.currentDate = util.formatTime(new Date());
    this.setData({
      product: product,
      clubCount: clubCount,
      start: start,
      end: end
    });

    WxParse.wxParse('remark', 'html', product.remark, this);
  },

  // 用户选择改变日期
  changeDate: function(e){
    let product = this.data.product;
    product.currentDate = e.detail.value;
    this.setData({
      product: product
    });
  },

  // 用户点击购买按钮
  goBuy: function(){
    let param = {
      productId: this.data.product.id,
      productName: this.data.product.name,
      productPrice: this.data.product.cost,
      image: this.data.product.image1,
      productType: this.data.product.productType,
      time: this.data.product.currentDate
    }
    let product_data = encodeURI(JSON.stringify(param));
    wx.navigateTo({
      url: `../order/order?product=${product_data}`
    });
  },

  // 查看适用店面列表
  toClubList: function () {
    wx.setStorageSync('useRange', this.data.product.useRange);
    wx.navigateTo({
      url: '../clubList/clubList'
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