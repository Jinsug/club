var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
       course:{
           // 给一个默认图，以免第一次渲染没有找到图片，而报404错误  
           image:"1.jpg"
       }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var objx = this;

     // 取出上一页面存储的course
     var courseId = options.courseid;
     objx.getDatas(courseId);
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
   * 上报预约课程 发送模板消息所需信息
   */
  submitAppointment: function (e) {
    var objx = this;
    objx.setData({
      source:e.detail.formId
    })
    objx.appointment();
  },

  /**
   * 上报预约课程 发送模板所需信息
   */
  uploadFormId: function (type_id) {
    var objx = this;
    var param = {};
    param.source = objx.data.source;
    param.openid = wx.getStorageSync('openId');
    param.memberId = wx.getStorageSync('memberId');
    param.clubId = wx.getStorageSync('clubId');
    param.type = 'appointment';
    param.type_id = type_id;
    wx.request({
      url: app.request_url + 'uploadFormId.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: JSON,
      success: function (res) {
        res = JSON.parse(res.data);
        console.log(JSON.stringify(res));
      },
      error: function (e) {
        wx.showModal({
          title: '提示',
          content: '网络异常',
          showCancel: false
        })
      }
    })
  },

  /**
   * 预约课程
   */
  appointment: function () {
      var objx = this;
      var courseId = objx.data.course.id;
      var memberId=  wx.getStorageSync("memberId");
      var param = {};
      param.courseId = courseId;
      // 会员从团体课表中预约 type = 2
      param.type = 2;
      param.memberId = memberId;

      // 发送预约请求
      wx.request({
        url: app.request_url + 'appointment.asp',
        dataType:JSON,
        data:{
            json:encodeURI(JSON.stringify(param))
        },
        success: function (res) {
          res = JSON.parse(res.data);
          if (res.success) {
             // 预约信息发送成功，上报发送模板消息的信息
             objx.uploadFormId(res.appointment_id);
             wx.showModal({
               title: "提示",
               content: "您的预约申请发送成功，请等候俱乐部审批",
             })
             // 跳转到"我的预约"中
          } else {
             wx.showModal({
               title: "提示",
               content: res.message,
             })
          }
        }
      })


  },

  /**
   * 根据id查询当前的课程信息
   */
  getDatas:function (courseId) {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    // 测试数据
    // memberId = "12764";
    var param = {};
    param.memberId = memberId;
    param.courseId = courseId;
    // console.log(courseId);

    // 发起网络请求
    wx.request({
      url: app.request_url + 'findCourseById.asp',
      dataType:JSON,
      data:{
        json: encodeURI(JSON.stringify(param))
      },
      success: function (res) {
        // 网络请求成功
        res = JSON.parse(res.data);
        if (res.success) {
          // 测试数据
          // var cc = {
          //   image:"1.jpg",
          //   courseName:"舞蹈",
          //   startTime:"09:00",
          //   endTime:"10:00",
          //   planDate:"2018-05-16",
          //   coachName:"dou",
          //   clubName:"中南财经政法大学",
          //   vip_price:"0.00",
          //   normol_price:"12",
          //   isVip:true,
          //   courseId:"385827"
          // };
          // res.course = cc;
          // 数据请求成功
          var isFree = false;
          var role = res.course.isVip;
          if (role) {
            if (parseFloat(res.course.vip_price) == 0.00) {
              isFree = true;
            }
          } else {
            if (parseFloat(res.course.normol_price) == 0.00) {
              isFree = true;
            }
          }
          objx.setData({
            course:res.course,
            isFree:isFree
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
   * 去支付
   */
  gotoBuy:function () {
    // 处理参数
    var objx = this;
    var course = objx.data.course;
    var price = "0";
    if (course.isVip) {
      price = course.vip_price;
    } else {
      price = course.normol_price;
    }
    var param = {};
    param.productId = course.id;
    param.productName = course.courseName;
    param.productPrice = price;
    param.image = course.image;
    param.productType = "course";
    param.time = course.planDate;

    // 跳转到提交订单页面
    wx.navigateTo({
      url: '../../pages/order/order?product=' + encodeURI(JSON.stringify(param)),
    })
  }



})