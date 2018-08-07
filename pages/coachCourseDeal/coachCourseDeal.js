var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime:"20:00",
    endTime:"21:00",
    courseDate:"2018-03-27",
    courseNames: ["瘦身减重","健美增肌","运动康复","提高运动表现"],
    index:0,
    courseId:"",
    courseList: [{ "id": 1231, "courseName": "瘦身减重" }, { "id": 12345, "courseName": "健美增肌" }, { "id": 4456, "courseName": "运动康复" }, { "id": 9543, "courseName": "提高运动表现"}],
    courseAddress:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var coachName = options.coachName;
      var planDate = options.planDate;
      var date = new Date();
      var YYYY = date.getFullYear();
      var MM = date.getMonth()+1;
      var dd = date.getDate();
      if (MM < 10) {
        MM = "0" + MM;
      }

      if (dd < 10) {
          dd = "0" + dd;
      }
      var currentDate = YYYY + "-" + MM + "-" + dd; 
      this.setData({
          courseDate: planDate,
          coachName:coachName

      })

      this.getCourseData();
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
  * 获取私教课程数据
  */
  getCourseData: function () {
     var objx = this;
     var param = {};
     var memberId = wx.getStorageSync("memberId");
     var coachId = wx.getStorageSync("coachId");
     param.memberId = memberId;
     param.coachId = coachId;
     
     // 请求后台，获取课程
     wx.request({
       url: app.request_url + 'loadCourseInfo.asp',
       dataType: JSON,
       data: {
         json: encodeURI(JSON.stringify(param))
       },
       success: function (res) {
        res = JSON.parse(res.data);
         if (res.success) {
           // 请求数据成功
           objx.setData({
             courseList:res.items,
             courseId:res.items[0].id
           })

         } else {
           // 请求数据失败
           wx.showModal({
             title: "提示",
             content: "获取数据失败！",
           })
         }
       },
       error: function (e) {
         wx.showModal({
           title: "提示",
           content: "网络异常！",
         })
       }
     })
     
  },

  /**
   * 课程名称
   */
  bindPickerChange: function (e) {
     var objx = this;
     var index = e.detail.value;
     var courseId = objx.data.courseList[index].id;
     objx.setData({
       index: index,
       courseId: courseId
     })
  },


  /**
   * 课程时间
   */
  bindcourseDateChange: function (e) {
     var objx = this;
     var courseDate = e.detail.value;
     objx.setData({
         courseDate:courseDate
     })
  },

  /**
   * 开始时间
   */
  bindStartTimeChange: function(e) {
   var objx = this;
   var startTime = e.detail.value;
   objx.setData({
       startTime:startTime
   })
 },

 /**
  * 结束时间
  */
  bindEndTimeChange: function (e) {
    var objx = this;
    var endTime = e.detail.value;
    objx.setData({
        endTime:endTime
    })
  },

  /**
   * 课程地址
   */
  bindInputCourseAddress: function (e) {
    var objx = this;
    var courseAddress = e.detail.value;
    objx.setData({
        courseAddress:courseAddress
    })
  },

  /**
   * 会员点击确定按钮
   */
  appointmentCourse: function () {
      var objx = this;
      var courseAddress = objx.data.courseAddress;
      if (courseAddress == "") {
        wx.showModal({
          title: "提示",
          content: "请先填写课程地址",
        })
        return;
      }
      var param = {};
      param.courseAddress = courseAddress;
      param.coachId = wx.getStorageSync("coachId");
      param.memberId = wx.getStorageSync("memberId");
      param.courseId = objx.data.courseId;
      param.planDate = objx.data.courseDate;
      param.startTime = objx.data.startTime;
      param.endTime = objx.data.endTime;

      // 请求后台
      wx.request({
        url: app.request_url + 'appointmentCoachCourse.asp',
        dataType:JSON,
        data:{
          json:encodeURI(JSON.stringify(param))
        },
        success: function (res) {
          res = JSON.parse(res.data);
          if (res.success) {
            // 请求成功，跳转到教练课表页面
            wx.showModal({
              title: '提示',
              content: '您的预约已经成功',
              success: function(ress) {
                if (ress.confirm) {
                    wx.navigateTo({
                      url: '../../pages/coachCourseList/coachCourseList?coachName=' + objx.data.coachName,
                    })
                }
              }
            })
          

          } else {
            // 请求数据失败
            var message = res.message;
            if (message == "joining") {
                message = "您已经预约过此课程，不再再次进行预约！";
            } else if (message == "exist") {
                message = "您当前时间有其它的课程，请确认！";
            }
            wx.showModal({
              title: "提示",
              content: message,
            })
          }
        },
        error: function (e) {
           wx.showModal({
             title: "提示",
             content: "网络异常！",
           })
        }
      })

  }




})