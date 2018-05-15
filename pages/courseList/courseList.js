Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    dou_dates: ["preDate", "preDate", "preDate", "preDate", "preDate", "preDate","preDate"],
    login_button:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var toDate = new Date();
    var mm = toDate.getMonth() + 1;
    var dd = toDate.getDate();
    if ( mm < 10 ) {
        mm = "0" + mm;
    }
    if ( dd < 10 ) {
        dd = "0" + dd;
    }
    var toDay = toDate.getFullYear() + "-" + mm + "-" + dd;
    this.getDates("2018-03-26");
    // 设置图片高宽
    this.getEquipmentWidth();
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
    var objx = this;
    objx.checkLoginStatus();
    
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
   * JS获取当前周从星期一到星期天的日期
   */
  getDates: function (currentTime) {
    var objx = this;
    var currentDate = new Date(currentTime);
    var timesStamp = currentDate.getTime();
    var currenDay = currentDate.getDay();
    var dates = [];
    for(var i = 0; i< 7; i++) {
      var dou_date = new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7));
      var MM = dou_date.getMonth() + 1;
      var dd = dou_date.getDate();
      if ( MM < 10 ) {
         MM = "0" + MM;
      }
      if ( dd < 10 ) {
        dd = "0" + dd;
      }
  var param = {};
  var preDate = dou_date.getFullYear() + "-" + MM + "-" + dd;
  param.date = preDate;
  param.index = i;
  // 判断是不是今天
  if ( currentTime == param.date ) {
    param.index = "今天"
  }
  dates.push(param);
  
}
  // 将获取到的本周的数据存起来
  objx.setData({
      currentWeek:dates
  })

  objx.getDatas(currentTime);

},

/**
 * 用户选择日期后，将当天的数据查询出来
 */
getChooseDayData: function (date) {
    var objx = this;
    // 获取当前选中的日期
    var chooseDate = date.currentTarget.dataset.choosedate;

    // 获取但当前选中日期的下标
    var chooseIndex = date.currentTarget.dataset.chooseindex;
    
    // 将数据复原
    var objx_dates = objx.data.dou_dates;
    for(var i = 0; i < 7; i++) {
       objx_dates[i] = "preDate";
    }

    if (chooseIndex != "今天" && chooseIndex != "undefined") {
      objx_dates[chooseIndex] = "preDate chooseDate";
    }
    
    
    

    // 设值
    objx.setData({
       dou_dates:objx_dates
    })

    objx.getCurrentDateCourseList(chooseDate);



},
/**
 * 查询指定日期的课程数据
 */
getCurrentDateCourseList(currentDate) {
  var objx = this;
  var courseDataList = objx.data.courseDataList;
  // 取值
  var courseList = [];
  for ( var x = 0; x < courseDataList.length; x++ ) {
      if (courseDataList[x].planDate == currentDate) {
         courseList.push(courseDataList[x]);
      }
  }
  
  // 无数据
  var hasData = 0;
  if (courseList.length > 0) {
    // 有数据
    hasData = 1;
  }
  objx.setData({
     courseList:courseList,
     hasData:hasData
  })

},
/**
 * 处理图片高宽
 */
getEquipmentWidth: function () {
   var objx = this;
   // 获取设备高宽
   var sysInfo = wx.getSystemInfoSync();
   var winWidth = sysInfo.windowWidth;
   var pictureWidth = winWidth * 0.30;
   var pictureHeight = winWidth * 0.30 * 0.60;
   pictureWidth = pictureWidth.toFixed(0) + "px";
   pictureHeight = pictureHeight.toFixed(0) + "px";
   objx.setData({
     pictureWidth: pictureWidth,
     pictureHeight: pictureHeight
   })
},

/**
 * 获取一周内的团体课数据
 */
getDatas: function (currentDate) {
    var objx = this;
    var dou_dates = objx.data.currentWeek;
    var dates = [];
    for(var x = 0; x < dou_dates.length; x++) {
       dates.push(dou_dates[x].date);
    }
    var parma = {};
    parma.date = dates.toString();
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findCourse.asp',
      dataType:JSON,
      data:{
         json: encodeURI(JSON.stringify(parma))
      },
      success: function (res) {
         res = JSON.parse(res.data);
         if (res.success) {
             objx.setData({
                courseDataList:res.course
             })
             objx.getCurrentDateCourseList(currentDate);
           } else {
             console.log(res.message);
           }
      },
      error: function (e) {
          wx.showModal({
            title: '提示',
            content: '网络异常',
          })
      }
    })
},

/**
 * 预约团体课
 */
  appointment: function (e) {
      var objx = this;
      // 登录检查
      if (!objx.checkLogin()) {
        return;
      }
      var courseId = e.currentTarget.dataset.courseid;
      var courseList = objx.data.courseList;
      var course = {};
      for (var x = 0; x < courseList.length; x++) {
          if (courseId == courseList[x].id) {
             course = courseList[x];
          }
      }
      // 将当前课程存储起来
      wx.setStorageSync("course", course);
      
      // 跳转到预约页面
      wx.navigateTo({
        url: "../../pages/courseDeal/courseDeal"
      })
  },

  /**
   * check登录状态
   */
  checkLoginStatus: function () {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    var login_button = true;
    if (!memberId || memberId == "") {
      // 调用微信登录
      wx.login({
        success:function (login_res) {
          objx.setData({
              code:login_res.code,
              login_button:login_button
          })
        }
      })

    } else {
      // 已经登录，禁用登录按钮
      login_button = false;
      objx.setData({
        login_button:login_button
      })

    }
  },

  /**
   * wechatLogin
   */
  wechatLogin:function (e) {
    var objx = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      // 获取code
      e.detail.code = objx.data.code;

      // 请求登录后台
      wx.request({
        url: 'https://www.ecartoon.com.cn/clubmp!wechatLogin.asp',
        dataType:JSON,
        data:{
          json: JSON.stringify(e.detail)
        },
        success: function (res) {
          // 网络请求成功
          res = JSON.parse(res.data);
          if (res.success) {
            // 登录成功，将数据存储起来
            console.log(res);
            wx.setStorageSync("memberId", res.key);
            wx.setStorageSync("session_key", res.session_key);
            wx.setStorageSync("openId", res.openid);
          } else {
            // 程序异常，console打印异常信息
            console.log(res.message);
            wx.showModal({
              title: '提示',
              content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
            })
          }

          // 移除登录按钮
          objx.setData({
            login_button:false
          })
        },
        error: function (e) {
          // 网络请求失败
          wx.showModal({
            title: '提示',
            content: '网络异常',
            showCancel:false
          })
          return;

        }

      })
    } else {
      // 移除登录按钮
      objx.setData({
        login_button:false
      })
    }

  },

  /**
   * 使用功能前，登录检查
   */
  checkLogin: function () {
    var objx = this;
    var memberId = wx.getStorageSync("memberId");
    if (!memberId || memberId == "") {
      wx.showModal({
        title: '提示',
        content: '您取消了授权，需要在“发现”的小程序页面将“俱乐部小程序”删除，' +
                '重新登录授权才可以体验后续功能',
        showCancel:false,
        complete: function () {
          return false;
        }
      })
    } else {
      return true;
    }
  }

})