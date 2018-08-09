var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.source) {
      this.setData({
        source: options.source
      })
    }

    // 初始化
    this.methods.init(options.planId, this);
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
   * 用户触发分享
   */
  onShareAppMessage: function () {
    var plan = this.data.plan;
    var title = `“${plan.name}”帮助您拥有健康、幸福的人生`;
    var path = '/pages/planProduct/planProduct?planId=' + plan.id;
    return {
      title: title,
      path: path
    }
  },

  // 用户选择改变日期
  changeDate: function (e) {
    var plan = this.data.plan;
    plan.currentDate = e.detail.value;
    this.setData({
      plan: plan
    });
  },

  // 用户点击购买按钮
  goBuy: function () {
    // 验证登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=privateProduct&productId=' + this.data.product.id,
      })
      return;
    }

    var param = {
      productId: this.data.plan.id,
      productName: this.data.plan.name,
      productPrice: this.data.plan.price,
      image: this.data.plan.image1,
      productType: 'plan',
      time: this.data.plan.currentDate
    }
    var plan_data = encodeURI(JSON.stringify(param));
    wx.navigateTo({
      url: `../order/order?product=${plan_data}`
    });
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 初始化
     */
    init: function (planId, obj) {
      wx.request({
        url: 'https://www.ecartoon.com.cn/coachmp!loadPlan.asp',
        data: {
          id: planId,
          type: 3
        },
        success: function (res) {
          var plan = res.data.item;
          plan.currentDate = util.formatTime(new Date());
          plan.planTypes = { 'A': '瘦身减重', 'B': '健美增肌', 'C': '运动康复', 'D': '提高运动表现'}
          plan.applyObjects = { 'A': '初级', 'B': '中级', 'C': '高级'}
          plan.scenes = { 'A': '办公室', 'B': '健身房', 'C': '家庭', 'D': '户外'}
          obj.setData({
            plan: plan
          });
        }
      })
    }
  }
})