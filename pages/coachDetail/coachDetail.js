//获取应用实例
var  app = getApp()

Page({
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    base_img_url: 'https://www.ecartoon.com.cn/miniProgram/coach/img',
    defaultCoach: 334,
    coachInfo: {
      id: 0,
      name: '未知',
      image: 'https://www.ecartoon.com.cn/picture/user.jpg',
    },
   
    privateList: [],
    boxWidth: 0,
    planList: []
  },
  onLoad: function (options) {
    var obj = this;
    // 将教练id存入缓存
    if(options.coachId){
      wx.setStorageSync('coachId', options.coachId);
    } else {
      wx.setStorageSync('coachId', obj.data.defaultCoach);
    }
    obj.findCoachHome(obj);
  },
  
  // 请求教练数据
  findCoachHome: function(obj) {
    // 请求服务端数据
    var memberId = wx.getStorageSync('memberId');
    var coachId = wx.getStorageSync('coachId'); 
    // 测试数据
    memberId = 9388;
    coachId = 266;
    wx.request({
      url: app.request_url + 'findCoachDetail.asp',
      data: {
        memberId: memberId,
        coachId: coachId
      },
      success: function (res) {
        // console.log(res);
        if(!res.data.success){
          wx.showModal({
            title: '提示',
            content: '教练首页信息查询异常'
          });
          return;
        }
        var ratio = 45;
        obj.setData({
          coachInfo: {
            id: res.data.id,
            name: res.data.name,
            image: obj.data.base_picture_url + '/' + res.data.image,
            mobilephone: res.data.mobilephone
          },
          privateList: res.data.privateList,
          boxWidth: res.data.privateList.length * ratio + "%",
          planList: res.data.planList
        });
      }
    });
  },
  // 点击教练课表触发
  CoachTimetable: function() {
      wx.navigateTo({
        url: '../../pages/courseList/courseList?coachName=' + this.data.coachInfo.name
      })
  },
  // 点击简介触发
  CoachRemark: function() {
    wx.navigateTo({
      url: '../remark/remark'
    });
  },
  // 点击服务和资源触发
  CoachService: function() {
    wx.navigateTo({
      url: '../coachService/coachService'
    });
  },
  // 点击联系教练出发
  contactCoach: function() {
    
   
  },

  // 点击私教套餐进入私教套餐详情页面
  privateDetail: function (data){
    wx.navigateTo({
      url: '../privateProduct/privateProduct?productId=' + data.currentTarget.dataset.productid
    });
  },
  // 点击健身计划进入健身计划详情页面
  planDetail: function (data) {
    wx.navigateTo({
      url: '../plan/plan?planId=' + data.currentTarget.dataset.planid
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.coachInfo.name,
      path: '/pages/index/index?coachId=' + this.data.coachInfo.id
    }
  },
})
