Page({

  /**
   * 页面的初始数据
   */
  data: {
     memberData:{
        image:"1.jpg"
     },
     login_button:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
    // 获取加载页面参数
    var source = options.source;
    if (source) {
        objx.setData({
          source:source
        })
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
    var objx = this;
    objx.checkOnShow();
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
   * 查询当前用户的数据
   */
  findMe:function () {
      var objx = this;
      var memberId = wx.getStorageSync("memberId");
      var param = {};
      param.memberId = memberId;

      // 发起网络请求
      wx.request({
        url: "https://www.ecartoon.com.cn/clubmp!findMe.asp",
        dataType:JSON,
        data:{
           json:encodeURI(JSON.stringify(param))
        },
        success: function (res) {
          // 请求成功
          res = JSON.parse(res.data);
          if (res.success) {
             // 获取数据成功
             objx.setData({
                memberData:res.memberData
             })
          } else {
            // 程序异常
            wx.showModal({
              title: "提示",
              content: res.message,
            })
          }
        },
        error: function (e) {
          // 请求失败
          wx.showModal({
            title: "提示",
            content: "网络异常",
          })
        }
      }) 
  },

  /**
   * 查看我的订单
   */
  gotoMyOrder: function () {
      var objx = this;
      // 登录检查
      if (!objx.checkOnFun()) {
         return;
      }
      wx.navigateTo({
        url: "../../pages/myOrder/myOrder",
      })
  },

  /**
   * 查看我的钱包
   */
  gotoMyWallet: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()){
       return;
    }
    wx.navigateTo({
      url: "../../pages/myWallet/myWallet",
    })
  },


  /**
   * 查看我的优惠券
   */
  gotoMyTicke: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: "../../pages/ticket/ticket",
    })
  },


  /**
   * 查看我的挑战
   */
  gotoMyActive: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: "../../pages/myActive/myActive",
    })
  },

  /**
   * 查看我的预约
   */
  gotoMyAppointment: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: '../../pages/myAppointment/myAppointment',
    })

    
  },

  /**
   * check进入页面时，是否已经登录
   */
  checkOnShow: function () {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    if (!memberId || memberId == "") {
      // 用户未登录，设置登录按钮可用
      wx.login({
        success: function (login_res) {
          objx.setData({
            login_button: true,
            code: login_res.code
          })
        }
      })
      
    } else {
      // 用户已登录，移除登录按钮
      objx.findMe();
      objx.setData({
        login_button: false
      })
    }
  },

  /**
   * 点击功能时，检查登录状态
   */
  checkOnFun: function () {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    if (!memberId || memberId == "") {
      wx.showModal({
        title: '提示',
        content: '您取消了授权，需要在“发现”的小程序页面将“俱乐部小程序”删除，' +
        '重新登录授权才可以体验后续功能',
        showCancel: false,
        complete: function () {
          return false;
        }
      })
    } else {
      return true;
    }

  },


  /**
  * wechatLogin
  */
  wechatLogin: function (e) {
    var objx = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      // 获取code
      e.detail.code = objx.data.code;

      // 请求登录后台
      wx.request({
        url: 'https://www.ecartoon.com.cn/clubmp!wechatLogin.asp',
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
            // 登录成功，判断是relaunch过来的，还是用户主动点击tabBar过来的
            var source = objx.data.source;
            if (!source || source == "" || source == "undefined" || source == undefined) {
              // 用户主动点击过来的
                objx.findMe();
            } else {
              // 跳转到来时的页面
                wx.switchTab({
                  url: '../../pages/' + source + '/' + source,
                })
              }

            
          } else {
            // 程序异常，console打印异常信息
            console.log(res.message);
            wx.showModal({
              title: '提示',
              content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
            })
          }

          // 移除登录按钮
          objx.setData({
            login_button: false
          })
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
   * 查看我的足迹
   */
  gotoMyFooter: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: "../../pages/myFooter/myFooter",
    })

  }



  
})