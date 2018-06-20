var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: app.constant.base_pic_url,
    dou_dates: ["preDate", "preDate", "preDate", "preDate", "preDate", "preDate","preDate"]
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
    this.setData({
      today: toDay
    })
    this.getDates(toDay);
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
    // 用户下拉，刷新当前页面数据
    var objx = this;
    var today = objx.data.today;
    objx.getDatas(today);
    
    // 数据请求完成，停止下拉
    wx.stopPullDownRefresh();
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
    // 分享当前页面时的参数
    var club = wx.getStorageSync("club");
    return {
      title: club.name + "团体课表",
      path: 'pages/courseList/courseList'
    }
  },
  /**
   * JS获取当前周从星期一到星期天的日期
   */
  getDates: function (currentTime) {
    var objx = this;
    var currentDate = new Date(currentTime);
    var timesStamp = currentDate.getTime();
    // 今天加上后面六天的数据
    var dates = [];
    var days = [];
    var param = {};

    // 当前月份
    var toMM = currentDate.getMonth() + 1;
    if (toMM < 10) {
      toMM = "0" + toMM;
    }

    // 今日
    var toDD = currentDate.getDate();
    if (toDD < 10) {
      toDD = "0" + toDD;
    }


    param.date = currentTime;
    param.mmdd = "今天";

    // 一起push到数组中
    dates.push(param);

    var dou_date = "";
    for(var i = 0; i < 6; i++) {
      var paramx = {};
      dou_date = new Date(currentDate.setDate(currentDate.getDate() + 1));
      var MM = dou_date.getMonth() + 1;
      var dd = dou_date.getDate();
      if ( MM < 10 ) {
         MM = "0" + MM;
      }
      if ( dd < 10 ) {
        dd = "0" + dd;
      }
  
    var preDate = dou_date.getFullYear() + "-" + MM + "-" + dd;
    paramx.date = preDate;
    paramx.mmdd = MM + "-" + dd;

    // push到数组中
    dates.push(paramx);
}
  // 将获取到的本周的数据存起来
  objx.setData({
      currentWeek:dates,
      currentDays: days
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

    // 获取当前选中日期的下标
    var chooseIndex = date.currentTarget.dataset.chooseindex;
    
    // 将数据复原
    var objx_dates = objx.data.dou_dates;
    for(var i = 0; i < 7; i++) {
       objx_dates[i] = "preDate";
    }
    
    // 将选中的日期设置为选中样式
    objx_dates[chooseIndex] = "pre chooseDate";
    
    
    

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
    var currentWeek = objx.data.currentWeek;
    var dates = [];
    for (var x = 0; x < currentWeek.length; x++) {
      dates.push(currentWeek[x].date);
    }
    var param = {};
    param.date = dates.toString();
    wx.request({
      url: app.request_url + 'findCourse.asp',
      dataType:JSON,
      data:{
        json: encodeURI(JSON.stringify(param))
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
      var memberId = wx.getStorageSync("memberId");
      if (memberId == "" || !memberId || memberId == undefined) {
          wx.reLaunch({
            url: '../../pages/mine/mine?source=courseList',
          })
          return;
      }
    
      var courseId = e.currentTarget.dataset.courseid;

      // 跳转到预约页面
      wx.navigateTo({
        url: "../../pages/courseDeal/courseDeal?courseid=" + courseId
      })
  }

  
})