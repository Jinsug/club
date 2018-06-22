var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    priceActive:{
      activePoster:"1.jpg"
    },
    cutd:null
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
    var priceActiveId = options.priceActiveId;
    var id = options.parent;
    
    // 用户分享的页面，需要加入返回首页按钮
    if (id) {
      objx.setData({
        id:id,
        goHome:true
      })
    }
    objx.setData({
      priceActiveId: priceActiveId
    })
    
    var memberId = wx.getStorageSync("memberId");
    if (memberId) {
       // 用户已登录的情况下，发起砍价
       objx.priceCutdown();
    } else {
       objx.getDatas(objx.data.id, objx.data.priceActiveId);
    }
     
    // 获取设备信息
    objx.getSysInfo();
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var objx = this;
    var price = objx.data.priceActive;
    objx.getDatas(price.id, price.priceActive);
    wx.stopPullDownRefresh();
  },

 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 找人帮砍
    var objx = this;
    var priceActive = objx.data.priceActive;
    return{
        title: priceActive.name + '正在参加' + priceActive.activeName,
        path: 'pages/priceCutdown/priceCutdown?parent=' + priceActive.id + '&priceActiveId=' + priceActive.priceActive
    }
  },


  /**
   * 点击切换
   */
  clickTab: function (e) {
    var objx = this;
    var currentTab = e.target.dataset.current;
    if (currentTab == objx.data.currentTab) {
      return false;
    } else {
      objx.setData({
        currentTab: currentTab
      })
    }
  },

  /**
   * 滑动切换
   */
  swiperTab: function (e) {
    var objx = this;
    objx.setData({
      currentTab: e.detail.current
    })
  }
  ,
  /**
   * 获取页面高度
   */
  getEquipmentHeight: function () {
    var objx = this;
    var info = wx.getSystemInfoSync();
    var eqHeight = info.windowHeight;
    objx.setData({
      eqHeight: eqHeight
    })
  },

  /**
   * 用户未登录的情况下获取页面数据
   */
  getDatas: function (id, priceActive) {
     var objx = this;
     var param = {
       id:id,
       priceActive:priceActive
     };
     // 发起网络请求
     wx.request({
       url: app.request_url + 'getCutdownInfo.asp',
       dataType:JSON,
       data:{
         json: encodeURI(JSON.stringify(param))
       },
       success: function (res) {
         // 网络请求成功
         res = JSON.parse(res.data);
         console.log(res);
         objx.setData({
           priceActive: res,
           remark: res.remark == undefined ? '' : res.remark
         })
         // handle remark
         WxParse.wxParse('remark', 'html', objx.data.remark, objx, 5);
         
         objx.countdown();
       },
       error: function (e) {
         // 网络请求失败
         console.log("网络请求失败，原因是： " + e);
       }

     })
  },

   /**
    * 我也要发起砍价
    */
    meToo: function () {
      var objx = this;
      objx.setData({
        id:"meToo"
      })

      // 调用砍价方法
      objx.priceCutdown();
    },
  /**
   * 进行砍价，并且将数据返回
   * priceCutdown
   */
  priceCutdown: function () {
    var objx = this;
    
    // 用户登录检查
    if (!objx.checkLoginOnFun()) {
       return false;
    }

    // 活动过期检查
    if (objx.data.priceActive.hasExpiration) {
       wx.showModal({
         title: '提示',
         content: objx.data.priceActive.message,
         showCancel:false
       })
       return;
    }

    var memberId = wx.getStorageSync("memberId");
    var priceActiveId = objx.data.priceActiveId;
    var id = objx.data.id;
    if (id == "meToo") {
        id = null;
    }

    var param = {
      priceActive: priceActiveId,
      memberId:memberId
    }

    // 如果id存在，则传递id
    if (id) {
      param.id = id;
    }

    // 发起网络请求，开始砍价
    wx.request({
      url: app.request_url + 'cutdownPrice.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        console.log(res);
        wx.showModal({
          title: '提示',
          content: res.message,
        })
        
        if (res.priceActive) {
          // 刷新当前页面数据
          objx.getDatas(res.id, res.priceActive);
        }
       objx.setData({
         cutActive: res.cutActive,
         already: res.already
       })

      },
      error:function (e) {
        // 网络请求失败
        console.log(e);
      }
    })
  },


  /**
   * 页面实现倒计时
   */
  countdown: function () {
    var objx = this;
    var expiration = objx.data.priceActive.expiration;
    if (objx.data.sysInfo.platform == 'ios') {
      expiration = expiration.replace(/-/g,'/');
    }
    var currentDate = new Date();
    var expirationDate = new Date(expiration);
    
    var days = expirationDate.getTime() - currentDate.getTime();
    
    // 精确到秒
    var expirationMsg = parseInt(days / 1000);
    
    // 之前有倒计时的，清除掉
    if (objx.data.cutd) {
       clearInterval(objx.data.cutd);
    }
    var cutd = setInterval(function () {
        var d = parseInt(expirationMsg / 24 / 60 / 60);
        var dx = (d * 24 * 60 * 60);
        var h = Math.floor((expirationMsg - dx) / (60 * 60));
        var hx = (h * 60 * 60);
        var m = Math.floor((expirationMsg - dx -hx) / 60);
        var mx = (m * 60);
        var s = Math.floor(expirationMsg - dx - hx -mx);
        objx.setData({
          DD: d < 10 ? "0" + d : d,
          HH: h < 10 ? "0" + h : h,
          MM: m < 10 ? "0" + m : m,
          SS: s < 10 ? "0" + s : s
        })
        expirationMsg--;
        if (expirationMsg < 0) {
          objx.setData({
            DD: "00",
            HH: "00",
            MM: "00",
            SS: "00"
          })
          // 清除倒计时
          clearInterval(cutd);

        }
      } ,1000)
      objx.setData({
        cutd:cutd
      })

  },

  /**
   * 登录验证
   */
  checkLoginOnFun: function () {
    var objx = this;
    var memberId = wx.getStorageSync('memberId');
    if (!memberId || memberId == '' || memberId == 'null' || memberId == 'undefined') {
      // 跳转到我的页面登录
      wx.reLaunch({
        url: '../../pages/mine/mine?source=priceCutdown&priceCutdownId=' + objx.data.id + '&priceActiveId=' + objx.data.priceActiveId,
      })
      return false;
    } else {
      return true;
    }
  },


  /**
   * 立即购买
   */
  gotoBuy: function () {
    var objx = this;

    // 活动过期检查
    if (objx.data.priceActive.hasExpiration) {
      wx.showModal({
        title: '提示',
        content: objx.data.priceActive.message,
        showCancel: false
      })
      return;
    }

    var now = new Date();
    var MM = now.getMonth() + 1;
    if (MM < 10) {
      MM = "0" + MM;
    }
    var dd = now.getDate();
    if (dd < 10) {
      dd = "0" + dd;
    }
    var priceActive = objx.data.priceActive;
    var productPrice = priceActive.currentMoney;
    // productPrice = 0.01;

    var product = {
       productId: priceActive.prodId,
       productType: "priceCutdownProduct",
       productName: priceActive.prodName,
       time: now.getFullYear() + "-" + MM + "-" + dd,
       productPrice: productPrice,
       image: priceActive.prodImage,
       priceId: priceActive.id,
       showTicket:true
    };

    // 跳转到订单页面
    wx.navigateTo({
      url: '../../pages/order/order?product=' + encodeURI(JSON.stringify(product)),
    })
  },


  /**
   * 跳转商品详情页
   */
  gotoProduct: function () {
    var objx = this;
    wx.navigateTo({
      url: '../../pages/product/product?productId=' + objx.data.priceActive.prodId + '&source=priceCutdown',
    })
  },

  /**
   * 获取手机型号，主要识别IOS
   */
  getSysInfo: function () {
    let objx = this;
    let sysInfo = wx.getSystemInfoSync();
    objx.setData({
      sysInfo: sysInfo
    })
  },

  /**
  * wxml绑定函数:主页按钮点击绑定(回到主页)
  */
  goHome: function () {
    wx.switchTab({
      url: '../../pages/index/index'
    });
  }

})