Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTap:0,
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
    var priceActive = options.priceActive;
    var id = options.parent;
    if (id) {
      objx.setData({
        id:id
      })
    } 
    objx.setData({
      priceActive:priceActive
    })
    
    var memberId = wx.getStorageSync("memberId");
    if (memberId) {
      // 用户已登录的情况下，发起砍价
       objx.priceCutdown();
    } else {
       objx.getDatas(objx.data.id, objx.data.priceActive);
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
      currentTap: e.detail.current
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
       url: 'https://www.ecartoon.com.cn/clubmp!getCutdownInfo.asp',
       dataType:JSON,
       data:{
         json: encodeURI(JSON.stringify(param))
       },
       success: function (res) {
         // 网络请求成功
         res = JSON.parse(res.data);
         objx.setData({
           priceActive: res
         })
         objx.countdown();
       },
       error: function (e) {
         // 网络请求失败
         console.log("网络请求失败，原因是： " + e);
       }

     })
  },

  /**
   * 进行砍价，并且将数据返回
   * priceCutdown
   */
  priceCutdown: function () {
    var objx = this;
    
    // 用户登录检查
    var memberId = wx.getStorageSync("memberId");
    var priceActive = objx.data.priceActive;
    var id = objx.data.id;

    // 测试数据
    // memberId = 9388;
    // priceActive = 23;
    // id = 27
    var param = {
      priceActive:priceActive,
      memberId:memberId
    }
    // 如果id存在，则传递id
    if (id) {
      param.id = id;
    }

    // 发起网络请求，开始砍价
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!cutdownPrice.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        wx.showModal({
          title: '提示',
          content: res.message,
        })
        
        if (res.success) {
          // 发起砍价成功
          priceActive = res.priceActive;
          id = res.id;
        }
        // 刷新当前页面数据
        objx.getDatas(id, priceActive);

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
    var currentDate = new Date();
    var expirationDate = new Date(expiration);
    
    var days = expirationDate - currentDate;
    
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

  }
  

})