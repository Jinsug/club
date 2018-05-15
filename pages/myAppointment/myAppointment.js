import regeneratorRuntime from '../../utils/runtime.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
     base_pic_url:"https://www.ecartoon.com.cn/picture"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objx = this;
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
    var hasData = 0;
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
        if (res.success) {
          // 请求数据成功
          var appointmentList = res.appointmentList;
          if (appointmentList && appointmentList.length > 0 && appointmentList[0].image != "null" && appointmentList[0].image != null) {
             hasData = 1;
          }
          objx.setData({
            appointmentList: appointmentList,
            hasData: hasData
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

  }
})