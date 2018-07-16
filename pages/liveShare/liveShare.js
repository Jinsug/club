var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    live: {},
    isLogin: false,
    checkMobilePhone: true
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
      title: `“${liveName}” 将于 ${startTime} 开讲，欢迎参加本次讲座`,
      path: 'pages/liveShare/liveShare?source=1&live=' + encodeURI(JSON.stringify(this.data.live))
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
   * wxml绑定函数:登录按钮点击绑定
   */
  bindLoginButtonTap: function (e) {
    this.methods.wechatLogin(e, this);
  },

  /**
   * wxml绑定函数:获取手机号按钮点击绑定
   */
  bindPhoneNumberButtonTap: function (e) {
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      return;
    }
    this.methods.getPhoneNumber(e, this);
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
      obj.methods.getUserInfo(1, obj);

      // 请求用户信息
      obj.methods.getUserInfo(0, obj);
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
    getUserInfo: function (type, obj) {
      var param = {
        memberId: type == 0 ? wx.getStorageSync('memberId') : obj.data.live.memberId
      }
      
      wx.request({
        url: app.request_url + 'getMemberInfo.asp',
        data: param,
        success: function (res) {
          var member = res.data;
          var data = {}
          if (type == 1) {
            data.member = member;
          }
          // 是否需要验证手机号
          if (type == 0 && member.memberMobilePhone && member.memberMobilePhone != '' && 
            member.mobileValid && member.mobileValid != '') {
            data.checkMobilePhone = false;
          }
          obj.setData(data);
        }
      });
    },


    /**
     * 获取用户手机号
     */
    getPhoneNumber: function (e, obj) {
      e.session_key = wx.getStorageSync("session_key");
      wx.request({
        url: app.request_url + 'decodePhoneNumber.asp',
        data: {
          json: JSON.stringify(e)
        },
        success: function (res) {
          // 获取和处理用户手机号
          var userPhoneNumber = res.data.phoneNumber;
          // 保存手机号
          wx.request({
            url: app.request_url + 'savePhoneNumber.asp',
            data: {
              memberId: wx.getStorageSync('memberId'),
              phoneNumber: userPhoneNumber
            },
            success: function (res) {
              obj.setData({
                checkMobilePhone: false
              });
            }
          });
        }
      })
    }
  }
})