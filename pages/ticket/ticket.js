Page({

  /**
   * 页面的初始数据
   */
  data: {
    tickets: {},
    productId: '',
    productType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.productId && options.productType){
      this.setData({
        productId: options.productId,
        productType: options.productType
      });
    }
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
    if(this.data.productId && this.data.productType){
      // 根据商品和商品类型查询优惠券
      this.findTicketByType();
    } else {
      // 查询当前用户所有优惠券
      this.findMyTicket();
    }
  },

  // 查询当前用所有优惠券
  findMyTicket: function () {
    let obj = this;
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findMyTicket.asp',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: (res) => {
        // 设置数据源
        obj.setData({
          tickets: res.data.ticketList,
          activeTicket: true
        });
      }
    });
  },

  // 查询适用优惠券
  findTicketByType: function(){
    let obj = this;
    let memberId = wx.getStorageSync("memberId");
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findTicketByType.asp',
      data: {
        memberId: memberId,
        productId: obj.data.productId,
        productType: obj.data.productType
      },
      success: function (res) {
        // 设置数据源
        obj.setData({
          tickets: res.data.tickets
        });
      }
    })
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
   * 用户点击优惠券
   */
  selectTicket: function(e) {
    if(!this.data.productId || !this.data.productType){
      return;
    }
    let ticket = e.currentTarget.dataset.ticket;
    wx.setStorageSync("ticket", ticket)
    wx.navigateBack({
      delta: 1
    });
  },
  
  /**
   * 激活优惠券
   */
  activeTicket: function () {
     wx.navigateTo({
       url: '../../pages/activeTicket/activeTicket',
     })
  }

})