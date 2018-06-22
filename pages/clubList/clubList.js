var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clubList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var useRange = wx.getStorageSync('useRange');
    this.methods.getClubListByCard(this, useRange);
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
   * 自定义函数
   */
  methods: {
    /**
     * 获取健身卡适用店面列表
     */
    getClubListByCard: (obj, useRange) => {
      wx.getLocation({
        success: (location) => {
          // 调用util方法进行坐标转换(腾讯坐标系转换为百度坐标系)
          var point = util.MapabcEncryptToBdmap(location.latitude, location.longitude);
          var param = {
            latitude: point.lat,
            longitude: point.lng,
            clubIds: useRange
          }
          param = encodeURI(JSON.stringify(param));
          obj.methods.requestServer(obj, param);
        },
        fail: () => {
          var param = {
            latitude: 0,
            longitude: 0,
            clubIds: useRange
          }
          param = encodeURI(JSON.stringify(param));
          obj.methods.requestServer(obj, param);
        }
      })
    },

    /**
     * 请求服务端数据
     */
    requestServer: (obj, param) => {
      wx.request({
        url: app.request_url + 'getClubListByCard.asp',
        data: {
          json: param
        },
        success: (res) => {
          obj.setData({
            clubList: res.data.clubList.map(obj.methods.convertMemberEvaluateScore)
          });
        }
      });
    },

    /**
     * 处理用户评论分数(将百分制转换为5分制,保留原分数)
     */
    convertMemberEvaluateScore: (club) => {
      let convertScoreToStars = (score) => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
          if (i <= score - 1) {
            stars.push('201805161040.png');
          } else {
            stars.push('201805161039.png');
          }
        }
        return stars;
      }
      // 将百分制转换为五分制
      club.totalityScoreAsFive = club.totalityScore / 20;
      club.serviceScoreAsFive = club.serviceScore / 20;
      club.deviceScoreAsFive = club.deviceScore / 20;
      club.evenScoreAsFive = club.evenScore / 20;
      // 根据分数计算星星个数
      club.totalityStars = convertScoreToStars(club.totalityScoreAsFive);
      club.serviceScoreStars = convertScoreToStars(club.serviceScoreAsFive);
      club.deviceScoreStars = convertScoreToStars(club.deviceScoreAsFive);
      club.evenScoreStars = convertScoreToStars(club.evenScoreAsFive);
      // 判断用户是否允许请求坐标
      if(club.mLatitude == 0 || club.mLongitude == 0){
        club.distance = 0;
      }
      return club;
    },

    /**
     * 转换俱乐部列表数据中的坐标为腾讯系坐标
     */
    convertPoint: (club) => {
      // 调用util方法进行坐标转换(百度坐标系转换为腾讯坐标系)
      var point = util.BdmapEncryptToMapabc(club.latitude, club.longitude);
      club.latitude = point.lat;
      club.longitude = point.lng;
      return club;
    }
  },

  /**
   * wxml绑定函数: 底部按钮点击绑定
   */
  goMap: function () {
    // 去地图中
    wx.setStorageSync('clubList', this.data.clubList.map(this.methods.convertPoint));
    wx.navigateTo({
      url: '../map/map'
    });
  }
})