var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化
    this.methods.init(options.productId, this);
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

  // 用户选择改变日期
  changeDate: function (e) {
    var product = this.data.product;
    product.currentDate = e.detail.value;
    this.setData({
      product: product
    });
  },

  // 用户点击购买按钮
  goBuy: function () {
    var param = {
      productId: this.data.product.id,
      productName: this.data.product.name,
      productPrice: this.data.product.price,
      image: this.data.product.image,
      productType: 'product',
      time: this.data.product.currentDate
    }
    var product_data = encodeURI(JSON.stringify(param));
    wx.navigateTo({
      url: `../order/order?product=${product_data}`
    });
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 初始化
     */
    init: function (productId ,obj) {
      wx.request({
        url: 'https://www.ecartoon.com.cn/coachmp!getPrivateInfo.asp',
        data: {
          id: productId
        },
        success: function (res) {
          var product = res.data;
          product.currentDate = util.formatTime(new Date());
          obj.setData({
            product: product
          });
        }
      })
    }
  }
})