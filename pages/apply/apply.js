var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
   * 申请备注输入框输入绑定
   */
  bindApplyContentInput: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  /**
   * 上报formId
   */ 
  submitApply: function (e) {
    wx.setStorageSync('sourceFormId', e.detail.formId);
    if (!this.data.content) {
      wx.showModal({
        title: '提示',
        content: '请输入申请备注',
        showCancel: false
      })
      return;
    }
    this.methods.apply(this);
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 申请加入
     */
    apply: function (obj) {
      // 请求服务器
      wx.request({
        url: app.request_url + 'request.asp',
        data: {
          memberId: wx.getStorageSync('memberId'),
          clubId: wx.getStorageSync('clubId'),
          content: obj.data.content
        },
        success: function(res){
          if(res.data.success){
            obj.methods.uploadFormId(res.data.msgId);
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    },

    // 将formId保存到服务器端
    uploadFormId: function (type_id) {
        var objx = this;
        var param = {};
        param.source = wx.getStorageSync('sourceFormId');
        param.openid = wx.getStorageSync('openId');
        param.memberId = wx.getStorageSync('memberId');
        param.clubId = wx.getStorageSync('clubId');
        param.type = 'apply';
        param.type_id = type_id;
        wx.request({
          url: app.request_url + 'uploadFormId.asp',
          data: {
            json: encodeURI(JSON.stringify(param))
          },
          dataType: JSON,
          success: function (res) {
            res = JSON.parse(res.data);
            wx.showModal({
              title: '提示',
              content: '您的加入申请已经发送给俱乐部，请等候俱乐部审批',
              showCancel: false,
              complete: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          },
          error: function (e) {
            wx.showModal({
              title: '提示',
              content: '网络异常',
              showCancel: false
            })
          }
        })
      }
    }
})