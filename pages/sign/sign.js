var app = getApp();
var util = require('../../utils/util.js');
var _this = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 114.3,
    latitude: 30.6,
    markers: [
      {
        longitude: 114.3, 
        latitude: 30.6, 
        iconPath: '../../icon/marker.png',
        width: 20,
        height: 20 
      }
    ],
    orderIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;

    // 页面初始化
    _this.init();
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
   * 页面初始化
   */
  init: function () {
    // 查询用户信息
    _this.getMemberData();

    // 获取经纬度, 更新地图中心经纬度和标点经纬度
    wx.getLocation({
      success: function (res) {
        var markers = _this.data.markers;
        markers[0].longitude = res.longitude;
        markers[0].latitude = res.latitude;
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers: markers
        });
      }
    });

    // 获取当前系统时间并显示
    _this.setData({
      currentTime: util.formatTime(new Date(), "time")
    });

    // 查询当前可签到的订单数据
    _this.getSignOrderList();
  },

  /**
   * 查询当前用户的数据
   */
  getMemberData: function () {
    var memberId = wx.getStorageSync("memberId");
    var param = {};
    param.memberId = memberId;

    // 发起网络请求
    wx.request({
      url: app.request_url + 'findMe.asp',
      dataType: JSON,
      data: {
        json: encodeURI(JSON.stringify(param))
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
          _this.setData({
            memberData: res.memberData,
            hasMobilephone: hasMobilephone
          })
        } else {
          // 程序异常
          wx.showModal({
            title: "提示",
            content: res.message,
            showCancel: false
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
   * 查询签到订单列表
   */
  getSignOrderList: function () {
    wx.request({
      url: app.request_url + 'getSignOrder.asp',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function (res) {
        res.data.unshift({ id: 0, name: '线下会员订单' });
        _this.setData({
          signOrderList: res.data
        });
      }
    });
  },

  /**
   * 改变订单
   */
  changeOrder: function (e) {
    _this.setData({
      orderIndex: e.currentTarget.dataset.index
    });
  },

  /**
   * 取消签到
   */
  cancal: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 确定签到
   */
  success: function () {
    // 调用服务端接口
    var param = {
      memberId: wx.getStorageSync('memberId'),
      orderId: _this.data.signOrderList[_this.data.orderIndex].id,
      longitude: _this.data.longitude,
      latitude: _this.data.latitude
    }
    wx.request({
      url: app.request_url + 'sign.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        if (res.data.success) {
          wx.showModal({
            title: '提示',
            content: '签到成功，请到“我的足迹”对本次服务进行评价',
            showCancel: false,
            complete: function () {
              // 跳转至我的足迹页面
              wx.navigateTo({
                url: '../myFooter/myFooter'
              });
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          });
        }
      }
    });
  }
})