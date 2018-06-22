var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket: {},
    clubList: [],
    memberId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('memberId')){
      this.setData({
        memberId: wx.getStorageSync('memberId')
      });
    }
    if(options.shareMember){
      this.setData({
        shareMember: options.shareMember
      });
    }
    if(options.ticketId){
      this.setData({
        ticketId: options.ticketId
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
    this.methods.getTicketById(this.data.ticketId, this);
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
    var club = wx.getStorageSync('club');
    var memberId = wx.getStorageSync('memberId');
    var ticketId = this.data.ticket.ticketId;
    var title = club.name + this.data.ticket.name;
    var path = 'pages/ticketDetail/ticketDetail?shareMember='+memberId+'&ticketId='+ticketId;
    return {
      title: title,
      path: path
    }
  },

  /**
   * wxml绑定函数:赠送按钮点击绑定
   */
  sendTicket: function () {
    this.methods.clearTicketCollector(this);
  },

  /**
   * wxml绑定函数:领取优惠券按钮点击绑定(检查登录)
   */
  checkLogin: function () {
    if(!this.data.memberId){
      wx.reLaunch({
        url: '../mine/mine?source=ticketDetail&shareMember=' + this.data.shareMember + '&ticketId=' +
          this.data.ticket.ticketId
      })
    }
  },

  /**
   * wxml绑定函数:领取优惠券按钮点击绑定(获取手机号)
   */
  getPhoneNumber: function (e) {
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      return;
    }
    this.methods.deCodePhoneNumberAndreceive(e, this);
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
     * 通过id获取优惠券信息
     */
    getTicketById: function (ticketId, obj) {
      var param = {}
      param.ticketId = ticketId;
      if(obj.data.shareMember){
        param.shareMember = obj.data.shareMember;
      }
      // 请求服务端
      wx.request({
        url: app.request_url + 'getTicketById.asp',
        data: param,
        success: function (res) {
          obj.setData({
            ticket: res.data.ticket,
            clubList: res.data.clubList
          });
        }
      });
    },

    /**
     * 清除优惠券的领取人
     */
    clearTicketCollector: function (obj) {
      wx.request({
        url: app.request_url + 'clearTicketCollector.asp',
        data: {
          ticketId: obj.data.ticket.ticketId
        }
      });
    },

    /**
     * 解密手机号
     */
    deCodePhoneNumberAndreceive: function (e, obj) {
      e.session_key = wx.getStorageSync("session_key");
      wx.request({
        url: app.request_url + 'decodePhoneNumber.asp',
        data: {
          json: JSON.stringify(e)
        },
        success: function (res) {
          // 获取和处理用户手机号
          var userPhoneNumber = res.data.phoneNumber;
          // 领取优惠券
          obj.methods.receive(userPhoneNumber, obj);
        }
      })
    },

    /**
     * 领取优惠券
     */
    receive: function (phoneNumber, obj) {
      wx.request({
        url: app.request_url + 'setTicketToMember.asp',
        data: {
          memberId: wx.getStorageSync('memberId'),
          ticketId: obj.data.ticket.ticketId,
          phoneNumber: phoneNumber,
          shareMember: obj.data.shareMember
        },
        success: function (res) {
          wx.navigateTo({
            url: '../ticket/ticket'
          })
        }
      });
    }
  }
})