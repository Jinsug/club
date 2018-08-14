var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coachDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = this;
    if(wx.getStorageSync('coachDetail')){
      var coachDetail = wx.getStorageSync('coachDetail');
      obj.renderCoachData(coachDetail.baseList[0]);
    } else {
      wx.request({
        url: 'https://www.ecartoon.com.cn/coachmp!detail.asp',
        data: {
          id: wx.getStorageSync('coachId')
        },
        success: function(res){
          // console.log(res);
          // wx.setStorageSync('coachDetail', res.data);
          obj.renderCoachData(res.data.baseList[0]);
        }
      });
    }
  },

  // 渲染教练数据
  renderCoachData: function(coachDetail) {
    console.log(coachDetail);
    // 设置页面title
    var coachName = coachDetail.name;
    wx.setNavigationBarTitle({
      title: coachName,
    })
    // 教练类别
    var coachType = '';
    if (coachDetail.style == 'A') {
      coachType = '私人教练';
    } else {
      coachType = '团体教练';
    }
    // 教练专长
    var coachSpecialitys = coachDetail.speciality ? coachDetail.speciality.split(',') : [];
    for(var i = 0; i < coachSpecialitys.length; i++){
      if(coachSpecialitys[i].trim() == 'A'){
        coachSpecialitys[i] = '瘦身减重';
      } else if (coachSpecialitys[i].trim() == 'B') {
        coachSpecialitys[i] = '健美增肌';
      } else if (coachSpecialitys[i].trim() == 'C') {
        coachSpecialitys[i] = '运动康复';
      } else {
        coachSpecialitys[i] = '提供运动表现';
      }
    }
    // set至页面
    this.setData({
      coachDetail: {
        type: coachType,
        speciality: coachSpecialitys,
        description: coachDetail.description
      }
    });

    WxParse.wxParse('description', 'html', coachDetail.description || '', this, 0);
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
    
  }
})