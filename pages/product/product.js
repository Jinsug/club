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
    // 判断通过分享进入还是主页进入
    if(options.productId && options.shareMember){
      this.setData({
        shareMember: options.shareMember,
        productId: options.productId
      });
      this.methods.getProductByShare(options.productId, this);
    } else if (options.productId) {
      this.setData({
        productId: options.productId
      });
      this.methods.getProductByShare(options.productId, this);
    } else {
     this.methods.getProductByIndex(this);
    }

    if (options.source) {
       this.setData({
         source:options.source
       })
    }
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
    // 检查登录
    if (!wx.getStorageSync('memberId')) {
      var url = '';
      if (this.data.productId && this.data.shareMember){
        url = '../mine/mine?source=product&productId=' + this.data.productId + '&shareMember=' +
          this.data.shareMember;
      } else if (this.data.productId) {
        url = '../mine/mine?source=product&productId=' + this.data.productId;
      } else {
        url = '../mine/mine?source=product';
      }
      wx.reLaunch({
        url: url
      });
      return;
    }
    let param = {
      productId: this.data.product.id,
      productName: this.data.product.name,
      productPrice: this.data.product.cost,
      image: this.data.product.image1,
      productType: 'product',
      time: this.data.product.currentDate
    }
    if(this.data.shareMember){
      param.shareMember = this.data.shareMember
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
    
  },

  /**
   * 页面转发
   */
  onShareAppMessage: function () {
    return {
      title: this.data.product.freeProject,
      path: 'pages/product/product?productId=' + this.data.product.id
    }
  },

  /**
   * wxml绑定函数:主页按钮点击绑定(回到主页)
   */
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 获取商品(从主页进入)
     */
    getProductByIndex: function (obj) {
      let product = wx.getStorageSync('product');

      // 调用设置数据源
      obj.methods.setDataByProduct(product, obj);
    },

    // 获取商品(从分享进入)
    getProductByShare: function (id, obj) {
      wx.request({
        url: 'https://www.ecartoon.com.cn/clubmp!getProductById.asp',
        data: {
          id: id
        },
        success: function (res) {
          // 调用设置数据源
          obj.methods.setDataByProduct(res.data.product, obj);
        }
      });
    },

    /**
     * 设置数据源
     */
    setDataByProduct: function (product, obj) {
      let clubCount = product.useRange.split(",").length;
      // 设置日历的日期选择区间
      let start = util.formatTime(new Date());
      let end = util.formatTime(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)));
      // 获取当前系统时间
      product.currentDate = util.formatTime(new Date());
      obj.setData({
        product: product,
        clubCount: clubCount,
        start: start,
        end: end
      });

      WxParse.wxParse('remark', 'html', product.remark, obj);
    }
  }
})