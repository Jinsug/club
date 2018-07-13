var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    live: {},
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 接收参数
    var live = JSON.parse(decodeURI(options.live));
    var data = {
      live: live
    }
    if (options.source) {
      data.source = options.source;
    }
    this.setData(data);
    // 页面初始化
    this.methods.init(this);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var liveName = this.data.live.liveName;
    var startTime = this.data.live.startTime;
    return {
      title: `“${liveName}” 将于 ${startTime} 开讲，欢迎参加本次讲座！`,
      path: 'pages/liveShare/liveShare?source=1&live=' + encodeURI(JSON.stringify(this.data.live))
    }
  },

  /**
   * wxml绑定函数:登录按钮点击绑定
   */
  bindLoginButtonTap: function (e) {
    this.methods.wechatLogin(e, this);
  },

  /**
   * wxml绑定函数:进入直播间按钮点击绑定
   */
  bindLiveDetailButtonTap: function () {
    wx.setStorageSync('live', this.data.live);
    wx.navigateTo({
      url: '../liveDetail/liveDetail'
    })
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 页面初始化
     */
    init: function (obj) {
      // 判断是否登录
      if (!wx.getStorageSync('memberId')) {
        wx.login({
          success: function (login_res) {
            obj.setData({
              isLogin: true,
              code: login_res.code
            });
          }
        });
      } 

      // 请求主播
      obj.methods.getUserInfo(obj);
    },

    /**
      * wechatLogin
      */
    wechatLogin: function (e, obj) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        // 获取code
        e.detail.code = obj.data.code;

        // 请求登录后台
        wx.request({
          url: app.request_url + 'wechatLogin.asp',
          dataType: JSON,
          data: {
            json: JSON.stringify(e.detail)
          },
          success: function (res) {
            // 网络请求成功
            res = JSON.parse(res.data);
            if (res.success) {
              // 登录成功，将数据存储起来
              wx.setStorageSync("memberId", res.key);
              wx.setStorageSync("session_key", res.session_key);
              wx.setStorageSync("openId", res.openid);
              obj.setData({
                isLogin: false
              });

              // 提示用户
              wx.showModal({
                title: '提示',
                content: '登录成功',
                showCancel: false
              })
            } else {
              // 程序异常，console打印异常信息
              console.log(res.message);
              wx.showModal({
                title: '提示',
                content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
                showCancel: false
              })
            }
          },
          error: function (e) {
            // 网络请求失败
            wx.showModal({
              title: '提示',
              content: '网络异常',
              showCancel: false
            })
            return;
          }
        })
      }
    },

    /**
   * 请求用户信息
   */
    getUserInfo: function (obj) {
      wx.request({
        url: app.request_url + 'getMemberInfo.asp',
        data: {
          memberId: obj.data.live.memberId
        },
        success: function (res) {
          obj.setData({
            member: res.data
          });
        }
      });
    }
  }
})