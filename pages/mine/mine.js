import regeneratorRuntime from '../../utils/runtime.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     memberData:{
        image:"1.jpg"
     },
     login_button:true,
     hasMobilephone:0,
     hasLogin:0,
     base_img_url: 'http://fish.ecartoon.com.cn/static/img'
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
    
    if (options.productId){
      objx.setData({
        productId: options.productId
      })
    } 

    if (options.shareMember) {
      objx.setData({
        shareMember: options.shareMember
      });
    }

    if (options.activeId) {
      objx.setData({
        activeId: options.activeId
      });
    }

    if (options.priceActiveId) {
      objx.setData({
        priceActiveId: options.priceActiveId,
        priceCutdownId: options.priceCutdownId
      })
    }

    if(options.ticketId){
      objx.setData({
        ticketId: options.ticketId
      });
    }

    if (options.coachId) {
      objx.setData({
        coachId: options.coachId
      });
    }

    if (options.planId) {
      objx.setData({
        planId: options.planId
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
   * 查询当前用户的数据
   */
  getMemberData:function () {
      var objx = this;
      var memberId = wx.getStorageSync("memberId");
      var param = {};
      param.memberId = memberId;

      // 发起网络请求
      wx.request({
        url: app.request_url + 'findMe.asp',
        dataType:JSON,
        data:{
           json:encodeURI(JSON.stringify(param))
        },
        success: function (res) {
          // 请求成功
          res = JSON.parse(res.data);
          if (res.success) {
            // 用户数据请求成功
            var mobilephone = res.memberData.mobilephone;
            var mobileValid = res.memberData.mobileValid;
            var hasMobilephone = 0;
            if (mobilephone && "" != mobilephone && "null" != mobilephone && "undefined" != mobilephone && mobileValid && "" != mobileValid && "null" != mobileValid && "undefined" != mobileValid) {
              // 手机号存在，且已验证
              hasMobilephone = 1;
            }
             // 获取数据成功
             objx.setData({
                memberData:res.memberData,
                hasMobilephone:hasMobilephone
             })
          } else {
            // 程序异常
            wx.showModal({
              title: "提示",
              content: res.message,
              showCancel:false
            })
          }
        },
        error: function (e) {
          // 请求失败
          wx.showModal({
            title: "提示",
            content: "网络异常",
            showCancel: false
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
   * 我的计划
   */
  gotoMyPlan: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: '../../pages/plan/plan',
    })
  },

  /**
   * 私人订制
   */
  gotoPrivate: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()){
      return;
    }
    wx.navigateTo({
      url: '../../pages/private/private',
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
      objx.getMemberData();
      objx.setData({
        login_button: false,
        hasLogin:1
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
        content: '本小程序需要登录使用，请点击上面的“登录”按钮，用微信号登录获得完整体验。',
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
            objx.setData({
              hasLogin:1
            })
            // 登录成功，判断是relaunch过来的，还是用户主动点击tabBar过来的
            var source = objx.data.source;
            if (!source || source == "" || source == "undefined" || source == undefined) {
              // 用户主动点击过来的
              objx.getMemberData();
            } else {
              // 跳转到来时的页面
                if (source == "courseList" || source == "active" || source == "index" || source == "coachList") {
                    wx.switchTab({
                      url: '../../pages/' + source + '/' + source 
                    })
                } else if (source == "product") {
                    if (objx.data.productId && objx.data.shareMember) {
                      wx.navigateTo({
                        url: '../../pages/' + source + '/' + source + '?productId=' + objx.data.productId +
                        '&shareMember=' + objx.data.shareMember,
                      })
                    } else {
                      wx.navigateTo({
                        url: '../../pages/' + source + '/' + source + '?productId=' + objx.data.productId,
                      })
                    }
                } else if (source == "activeDetail") {
                  wx.navigateTo({
                    url: '../../pages/' + source + '/' + source + '?activeId=' + objx.data.activeId,
                  })
                } else if (source == "priceCutdown") {
                  wx.navigateTo({
                    url: '../../pages/' + source + '/' + source + '?parent=' + objx.data.priceCutdownId + '&priceActiveId=' + objx.data.priceActiveId,
                  })

                } else if (source == "ticketDetail") {
                  wx.navigateTo({
                    url: '../../pages/' + source + '/' + source + '?shareMember=' + objx.data.shareMember + '&ticketId=' + objx.data.ticketId,
                  })
                } else if (source == "coachDetail") {
                  wx.navigateTo({
                    url: '../../pages/' + source + '/' + source + '?coachId=' + objx.data.coachId + '&source=1'
                  })
                } else if (source == "privateProduct") {
                  wx.navigateTo({
                    url: '../../pages/' + source + '/' + source + '?productId=' + objx.data.productId + '&source=1'
                  })
                } else if (source == "planProduct") {
                  wx.navigateTo({
                    url: '../../pages/' + source + '/' + source + '?planId=' + objx.data.planId + '&source=1'
                  })
                } else {
                    wx.navigateTo({
                      url: '../../pages/' + source + '/' + source,
                    })
                }
              }

            
          } else {
            // 程序异常，console打印异常信息
            console.log(res.message);
            wx.showModal({
              title: '提示',
              content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
              showCancel:false
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

  },

  /**
   * 获取俱乐部wifi参数,同步过程中，被调用方法
   */
  getClubWifi: function () {
    var objx = this;
    return new Promise(function (resolve, reject){

      // 请求后台，获取wifi参数
      wx.request({
        url: app.request_url + 'getClubWifi.asp',
        dataType: JSON,
        success: function (res) {
          res = JSON.parse(res.data);
          if (res.success) {
            // 将数据存储起来
            objx.setData({
              clubWifi: res.clubWifi
            })
            resolve({success:true});
          } else {
            // 程序异常
            console.log(res.message);
            resolve({success:false})
          }
        },
        error: function (e) {
          // 网络请求失败
          console.log("网络异常");
          resolve({success:false})
        }
      })

    })
  },

  

  /**
   * 连接wifi
   */
  connectWifi: async function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }

    // wifi信息检查
    var hasWifi = await objx.getClubWifi();
    if (!hasWifi.success) {
      wx.showModal({
        title: '提示',
        content: '暂无可用wifi',
      })
      return;
    }

    // 获取wifi信息
    var clubWifi = objx.data.clubWifi;
    
    wx.startWifi({
      success: function (res) {
        // 连接wifi
        wx.connectWifi({
          SSID: clubWifi.ssid,
          BSSID: clubWifi.bssid,
          password: clubWifi.password,
          success: function (resdd) {
            wx.showModal({
              title: '提示',
              content: '已连接wifi',
              showCancel: false
            })
          },
          fail: function (e) {
            if (e.errCode == 12005) {
              wx.showModal({
                title: '提示',
                content: '请在手机设置中打开wifi开关后，再次尝试连接',
                showCancel:false
              })
            }
          }
        })

      }
    })
    
  },

  /**
   * 获取手机号
   */
  getPhoneNumber: function (e) {
    var objx = this;
    // 去后台解密手机号
    var session_key = wx.getStorageSync("session_key");
    e.session_key = session_key;
    wx.request({
      url: app.request_url + 'decodePhoneNumber.asp',
      dataType:JSON,
      data:{
        json: JSON.stringify(e)
      },
      success: function (res) {
        console.log(res);
        // 网络请求成功
        res = JSON.parse(res.data);
        // 数据请求成功
        var hasMobilephone = 1;
        objx.setData({
          hasMobilephone: hasMobilephone
        })

        console.log(res.phoneNumber);

        // 更新用户的手机号
        objx.updatePhoneNumber(res.phoneNumber);

        
      },
      error: function (e) {
        // 网络异常
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel:false
        })
      } 
    })

  },

  /**
   * 更新用户手机号
   */
  updatePhoneNumber: function (phoneNumber) {
    // 去后台更新用户的手机号信息
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    var param = {
      memberId:memberId,
      mobilephone:phoneNumber
    };

    // 请求后台数据
    wx.request({
      url: app.request_url + 'updateMobilephone.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        res = JSON.parse(res.data);
        if (res.success) {
          // 请求成功
          console.log("更新手机号成功");
        } else {
          // 程序异常
          console.log(res.message);
        }
      },
      error: function (e) {
        // 网络请求异常
        console.log("网络异常");
      } 
    })
  },

  /**
   * 检查登录
   */
  checkTapLogin: function () {
    wx.showModal({
      title: '提示',
      content: '本小程序需要登录使用，请点击上面的“登录”按钮，用微信号登录获得完整体验。',
      showCancel:false
    })
    return;
  },

  /**
   * 跳转到送人健康页面
   */
  gotoGiveHealth: function () {
    var objx = this;
    // 登录检查
    if (!objx.checkOnFun()) {
      return;
    }
    wx.navigateTo({
      url: '../../pages/qrlh/qrlh',
    })
  }

  


  
})