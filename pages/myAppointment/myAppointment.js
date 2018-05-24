import regeneratorRuntime from '../../utils/runtime.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
     currentTab:"0",
     base_pic_url:"https://www.ecartoon.com.cn/picture"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
    objx.getEquipmentHeight();
    objx.getDatas();
    
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
   * 查询我的预约数据
   */
  getDatas:function () {
    var objx = this;
    var hasAppliedData = 0;
    var hasApplyingData = 0;
    var memberId = wx.getStorageSync("memberId");
    var param = {};

    param.memberId = memberId;
    
    // 发起网络请求
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findAppointmentByMember.asp',
      dataType:JSON,
      data:{
        json:encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        console.log(res);
        if (res.success) {

          // 成功预约
          var appointmentListApplied = res.appointmentListApplied;
          if (appointmentListApplied && appointmentListApplied.length > 0 && appointmentListApplied[0].image != "null" && appointmentListApplied[0].image != null) {
            hasAppliedData = 1;
          }
           
          // 待审预约
          var appointmentListApplying = res.appointmentListApplying;
          if (appointmentListApplying && appointmentListApplying.length > 0 && appointmentListApplying[0].image != "null" && appointmentListApplying[0].image != null) {
            hasApplyingData = 1;
          }
          objx.setData({
            appointmentListApplied: appointmentListApplied,
            appointmentListApplying: appointmentListApplying,
            hasAppliedData: hasAppliedData,
            hasApplyingData: hasApplyingData
          })
        } else {
          // 程序异常
          wx.showModal({
            title: '提示',
            content: res.message,
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
  },

  /**
   * 提示用户是否取消预约
   */
  isCancel: function () {
      return new Promise(function (resolve, reject) {
        wx.showModal({
          title: '提示',
          content: '确定要取消预约吗？',
          success: function (sm) {
            if (sm.cancel) {
              resolve({success:false});
            } else {
              resolve({success:true});
            }
          }
        })
      });


  },

  /**
   * 用户点击取消预约
   */
  cancel: async function (e) {
    var objx = this;
    var isCancle = await objx.isCancel();
    if (!isCancle.success) {
      console.log("撤销操作");
      return;
    }
    var courseId = e.target.dataset.courseid;
    var memberId = wx.getStorageSync("memberId");
    var param = {};
    param.memberId = memberId;
    param.courseId = courseId;

    // 发起网络请求
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!undoAppointment.asp',
      dataType:JSON,
      data:{
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        if (res.success) {
          // 请求数据成功,刷新当前页面
          objx.getDatas();
        } else {
          // 请求数据失败
          wx.showModal({
            title: '提示',
            content: res.message,
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

  },

  /**
  * 点击切换
  */
  clickTab: function (e) {
    var objx = this;
    var currentTab = e.target.dataset.current;
    if (objx.data.currentTab == currentTab) {
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
  },

  /**
   * 获取设备高度
   */
  getEquipmentHeight: function () {
    var objx = this;
    var sysInfo = wx.getSystemInfoSync();
    var eqHeight = sysInfo.windowHeight + "px";
    objx.setData({
      eqHeight: eqHeight
    })
  }


})