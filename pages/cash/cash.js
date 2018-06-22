var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    countdown:0,
    getMobilecodeButton: "getMobilecodeButton"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var objx = this;
     objx.getCashAccount();
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
   * 查询提现账号 
   */
  getCashAccount: function () {
     var objx = this;
     var memberId = wx.getStorageSync("memberId");
     var param = {};
     param.memberId = memberId;
     wx.request({
       url: app.request_url + 'findCashAccount.asp',
       dataType:JSON,
       data:{
         json:encodeURI(JSON.stringify(param))
       },
       success: function (res) {
         // 请求成功，回调函数
         res = JSON.parse(res.data);
         if (res.success) {
           // 数据请求成功
           var account = res.account;
           var mobilephone = res.mobilephone;
           var hasAccount = "0";
           var hasMobilephone = "0";
           if (account.id != undefined) {
               hasAccount = "1";
           }
           if (mobilephone && mobilephone != "") {
               hasMobilephone = "1";
           }
           objx.setData({
             account:res.account,
             mobilephone:res.mobilephone,
             balance:res.balance,
             hasAccount: hasAccount,
             hasMobilephone: hasMobilephone
           })
         } else {
           // 数据请求失败
           wx.showModal({
             title: '提示',
             content: res.message,
           })
         }
       },
       error: function (e) {
         // 请求失败，网络异常
         wx.showModal({
           title: '提示',
           content: '网络异常',
         })
       }
     })
  },

  /**
   * 全部提现
   */
  cashAll: function () {
    var objx = this;
    var balance = objx.data.balance;
    objx.setData({
      inputMoney: balance
    })
  },

  /**
   * 提现金额输入框
   */
  cashMoneyInput:function (e) {
    var objx = this;
    objx.setData({
      inputMoney:e.detail.value
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
   * 获取短信验证码
   */
  getMobilecode: function () {
    var objx = this;
    var countdown = objx.data.countdown;
    if (parseInt(countdown) > 0) {
       return;
    }
    var mobilephone = objx.data.mobilephone;
    if (mobilephone == "" || mobilephone == "null" || mobilephone == undefined) {
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
    param.type = "1";

    // 发起网络请求
    wx.request({
      url: app.request_url + 'getMobileCode.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success:function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        if (res.success) {
          wx.showModal({
            title: '提示',
            content: '验证码已发送至您的手机，请注意查收！',
          })
          // 倒计时
          var x = 59;
          var getMobilecodeButton = "0";

          var xd = setInterval(function () {
            if (x > 0) {
              getMobilecodeButton = "countdown"
            } else {
              getMobilecodeButton = "getMobilecodeButton"
            }
            objx.setData({
              countdown:x,
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
          })
        }
      },
      error: function (e) {
        // 网络请求失败
        wx.showModal({
          title: '提示',
          content: '网络异常',
        })
      }
    })
    
  },

  /**
   * 申请提现
   */
  cashMoney: function () {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    var mobilephone = objx.data.mobilephone;
    if (mobilephone == "" || mobilephone == "null" || mobilephone == undefined) {
      console.log(mobilephone);
      wx.showModal({
        title: '提示',
        content: '请先获取手机号！',
      })
      return;
    }

    // 用户输入的提现金额
    var inputMoney = objx.data.inputMoney;

    // 可提现金额
    var balance = objx.data.balance;
    if (inputMoney == "" || inputMoney == "null" || inputMoney == undefined || parseFloat(inputMoney) == 0.00 || parseFloat(inputMoney) > parseFloat(balance) ) {
      wx.showModal({
        title: '提示',
        content: '提现金额应大于0，小于等于可提现金额！',
      })
      return;
    }
    var code = objx.data.code;
    if (code == "" || code == "null" || code == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先获取验证码！',
      })
      return;
    }

    // 数据验证通过，发起网络请求
    var param = {};
    param.memberId = memberId;
    param.mobilephone = mobilephone;
    param.pickMoney = inputMoney;
    param.code = code;

    wx.request({
      url: app.request_url + 'savePickDetail.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success:function (res) {
        res = JSON.parse(res.data);
        if (res.success) {
          // 数据请求成功
          wx.showModal({
            title: '提交成功',
            content: '您的提现申请发送成功，审核通过后，提现金额将支付到您的收款账户。',
            showCancel:false,
            complete:function () {
              // 跳转到我的钱包页面
              wx.navigateTo({
                url: '../../pages/myWallet/myWallet',
              })
            }
          })

          
        } else {
          // 程序异常
          wx.showModal({
            title: '提示',
            content: res.message,
          })
        }


      },
      error:function (e) {
        // 网络请求失败
        wx.showModal({
          title: '提示',
          content: '网络异常',
        })
      }
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
        dataType:JSON,
        data:{
          json:e
        },
        success: function (res) {
          res = JSON.parse(res.data);

          if (res.phoneNumber != undefined) {
            // 解密手机号成功,将手机号设置一下
            objx.setData({
              mobilephone:res.phoneNumber,
              hasMobilephone:1
            })

          } else {
            // 解密手机号程序异常
            wx.showModal({
              title: '提示',
              content: '解密手机号失败，请联系开发人员',
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

    } else {
      // 用户拒绝获取手机号
      wx.showModal({
        title: '提示',
        content: '您拒绝了授权，如需进行下一步操作，需您同意授权',
        showCancel:false
      })
    }

  },

  /**
   * 绑定支付宝账号
   */
  gotoAliAccount:function () {
    var objx = this;
    var mobilephone = objx.data.mobilephone;
    wx.navigateTo({
      url: '../../pages/bindAccount/bindAccount?mobilephone='+mobilephone + '&accountType=0',
    })
  },


  /**
   * 绑定银联账号
   */
  gotoUnoinAccount: function () {
    var objx = this;
    var mobilephone = objx.data.mobilephone;
    wx.navigateTo({
      url: '../../pages/bindAccount/bindAccount?mobilephone=' + mobilephone + '&accountType=1',
    })
  }

  

  
})