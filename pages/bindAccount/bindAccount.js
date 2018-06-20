var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    countdown:0,
    getMobilecodeButton:"getMobilecodeButton"
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
    // 加载当前页面时，取出参数
    var accountType = options.accountType;
    var barTitle = "";
    if (parseInt(accountType) == 0) {
        barTitle = "绑定支付宝";
    } else {
        barTitle = "绑定银行卡";
    }
    wx.setNavigationBarTitle({
      title: barTitle,
    })
    var mobilephone = options.mobilephone;
    var hasMobilephone = 0;
    if (mobilephone != "" && mobilephone != undefined && mobilephone != "undefined") {
        hasMobilephone = 1;
    }

    objx.setData({
      accountType: accountType,
      mobilephone: mobilephone,
      hasMobilephone: hasMobilephone
    })

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
  // onShareAppMessage: function () {
    
  // },

  /**
   * 支付宝账号输入框
   */
  aliAccountInput:function (e) {
    var objx = this;
    objx.setData({
      aliAccount:e.detail.value
    })
  },

  /**
  * 户名
  */
  nameInput: function (e) {
    var objx = this;
    objx.setData({
      name: e.detail.value
    })
  },

  /**
  * 银行卡号
  */
  unionAccountInput: function (e) {
    var objx = this;
    objx.setData({
      unionAccount: e.detail.value
    })
  },

  /**
  * 开户行
  */
  bankNameInput: function (e) {
    var objx = this;
    objx.setData({
      bankName: e.detail.value
    })
  },


  /**
   * 验证码输入框
   */
  mobilecodeInput: function (e) {
    var objx = this;
    objx.setData({
      code:e.detail.value
    })

  },


  /**
 * 获取用户手机号
 */
  getPhoneNumber: function (e) {
    var objx = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      var session_key = wx.getStorageSync("session_key");
      e.session_key = session_key;
      // 获取手机号成功，去后台解密手机号
      wx.request({
        url: app.request_url + 'decodePhoneNumber.asp',
        dataType: JSON,
        data: {
          json: e
        },
        success: function (res) {
          res = JSON.parse(res.data);

          if (res.phoneNumber != undefined) {
            // 解密手机号成功,将手机号设置一下
            objx.setData({
              mobilephone: res.phoneNumber,
              hasMobilephone: 1
            })

          } else {
            // 解密手机号程序异常
            wx.showModal({
              title: '提示',
              content: '解密手机号失败，请联系开发人员',
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
        }
      })

    } else {
      // 用户拒绝获取手机号
      wx.showModal({
        title: '提示',
        content: '您拒绝了授权，如需进行下一步操作，需您同意授权',
        showCancel: false
      })
    }

  },


  /**
   * 发送验证码
   */
  getCode:function () {
    var objx = this;
    if (objx.data.countdown > 0) {
      return;
    }
    // 验证手机号
    var mobilephone = objx.data.mobilephone;
    if (mobilephone == "" || mobilephone == "undefined" || mobilephone == undefined) {
      // 暂未获取到手机号，提醒用户获取手机号
      wx.showModal({
        title: '提示',
        content: '请先获取手机号！',
      })
      return;
    }

    var memberId = wx.getStorageSync("memberId");
    var param = {};
    param.memberId = memberId;
    param.mobilephone = mobilephone;
    param.type = "3";

    // 发起网络请求，发送验证码
    wx.request({
      url: app.request_url + 'getMobileCode.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        if (res.success) {
          // 发送短信成功
          wx.showModal({
            title: '提示',
            content: '验证码已发送至您的手机，请注意查收！',
            showCancel:false
          })

          // 60秒倒计时
          var x = 59;
          var getMobilecodeButton = "0";

          var xd = setInterval(function(){
            if (x > 0) {
               getMobilecodeButton = "countdown";
            } else {
               getMobilecodeButton = "getMobilecodeButton";
            }
          objx.setData({
            countdown: x,
            getMobilecodeButton: getMobilecodeButton
          })

          x--;

          // 停止倒计时，获取验证码功能恢复
          if (x < 0) {
            clearInterval(xd);
          }

          },1000)
        } else {
          // 程序异常
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel:false
          })
        }

      },
      error: function (e) {
        // 网络请求失败
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel:false
        })
      }
    })


  },

  /**
   * 绑定提现账号
   */
  saveCashAccount: function () {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    var accountType = objx.data.accountType;
    var code = objx.data.code;
    var account = 0;
    var param = {};
    // 支付宝账号
    if (parseInt(accountType) == 0) {
       account = objx.data.aliAccount;
       if (account == undefined || account == "" || account == "undefined") {
         // 未填写支付宝账号
         wx.showModal({
           title: '提示',
           content: '请先填写支付宝账号！',
           showCancel:false
         })
         return;
       }

    } 

    // 银联账号
    if (parseInt(accountType) == 1) {
       // 户名
       var name = objx.data.name;
       if (name == undefined || name == "" || name == "undefined") {
          wx.showModal({
            title: '提示',
            content: '请填写户名！',
            showCancel:false
          })
          return;
       }
       // 账号
       account = objx.data.unionAccount;

       if (account == undefined || account == "" || account == "undefined") {
         wx.showModal({
           title: '提示',
           content: '请填写卡号！',
           showCancel: false
         })
         return;
       }
       // 开户行
       var bankName = objx.data.bankName;
       if (bankName == undefined || bankName == "" || bankName == "undefined") {
         wx.showModal({
           title: '提示',
           content: '请填开户行！',
           showCancel: false
         })
         return;
       }

       param.bankName = bankName;
       param.name = name;
    }

    // 手机号
    var mobilephone = objx.data.mobilephone;
    if (mobilephone == "" || mobilephone == undefined || mobilephone == "undefined") {
      wx.showModal({
        title: '提示',
        content: '请先获取手机号！',
        showCancel: false
      })
      return;
    }

   

    // 短信验证码
    if (code == "" || code == undefined || code == "undefined") {
       wx.showModal({
         title: '提示',
         content: '请先填写验证码！',
         showCancel:false
       })
       return;
    }
    param.memberId = memberId;
    param.mobile = mobilephone;
    param.code = code;
    param.account = account;
    param.accountType = accountType;
    
    // 数据校验通过，发起网络请求
    wx.request({
      url: app.request_url + 'savePickAccount.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        res = JSON.parse(res.data);
        if (res.success) {
          // 数据请求成功
          wx.showModal({
            title: '提示',
            content: '绑定账号成功！',
            showCancel:false,
            complete: function () {
              // 跳转到提现页面
              wx.navigateTo({
                url: '../../pages/cash/cash',
              })
            }
          })
        } else {
          // 程序异常
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel:false
          })
        }

      },
      error: function (e) {
        // 网络请求失败
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel:false
        })
      }
    })

    


  }

})