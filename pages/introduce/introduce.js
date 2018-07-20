var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: app.constant.base_pic_url,
    club: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = this;
    let source = options.source;
    let clubId = options.clubId;
    // 分享过来的
    if (source) {
      obj.setData({
        clubId:clubId,
        source:source
      })
    } 

    let club = wx.getStorageSync('club');
    // 处理俱乐部营业日期将1,2,3格式转换为"星期一", "星期二", "星期三"格式
    let week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let workDateList = club.workDate.split(",");
    club.workDate = "";
    workDateList.forEach(function(item){
      let index = parseInt(item.trim()) - 1;
      club.workDate += week[index] + "&nbsp;";
    });

    var projectGrounp = [];
    var temporaryArr = [];
    var count = 0;
    club.projectList.forEach(function (item) {
      if (count < 3) {
        temporaryArr.push(item);
        count++
      } else {
        projectGrounp.push(temporaryArr);
        temporaryArr = [];
        count = 0;
      }
    });

    // 页面渲染数据
    this.setData({
      club: club,
      projectGrounp: projectGrounp
    });
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
   * 分享页面
   */
  onShareAppMessage: function () {
    var objx = this;
    var club = wx.getStorageSync('club');
    return {
      title: club.name + '介绍',
      path: 'pages/introduce/introduce?source=share&clubId=' + club.id
    }
  },

  /**
   * 请求后台数据
   */
  getDatas: function () {
    var objx = this;
    var club = wx.getStorageSync('club');
    var source = objx.data.source;
    var id = 0;
    // 正常加载页面过来的
    if (!source) {
       wx.setStorageSync('club', club);
    } else {
      // 分享过来的
      id = objx.data.clubId;
      // 发起网络请求
      wx.request({
        url: app.request_url + 'findClubById.asp',
        dataType: JSON,
        data: {
          id: id
        },
        success: function (res) {
          res = JSON.parse(res.data);
          if (res.success) {
            // 数据请求成功
            wx.setStorageSync('club', res.club);
          } else {
            // 程序异常
            wx.showModal({
              title: '提示',
              content: res.message,
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

    }

  },

  /**
   * wxml绑定函数:轮播图点击绑定
   */
  bindBannerListTap: function () {
    wx.navigateTo({
      url: '../projectList/projectList'
    })
  },


  /**
  * wxml绑定函数:主页按钮点击绑定(回到主页)
  */
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  }


})