var wxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentDayStr:'',
    isChoosed:false,
    dou_items: ["item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content"],
    hasNoData:2,
    planData:{},
    douDatas : [],
    toMonth:0,
    article:"Can You change a line ? <br/> Yes I'm change the line!<br/>"
  },
  onLoad: function (options) {
    var currentObj = this.getCurrentDayString()
    var YYYY = currentObj.getFullYear();
    var MM = currentObj.getMonth()+1;
    var dd = currentObj.getDate();
    if (MM < 10 ){
      MM = "0" + MM;
    }
    if (dd < 10 ) {
      dd = "0" + dd;
    }
    var planDate = YYYY + '-' + MM + '-' + dd;
   
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + MM + "月",
      currentDay: currentObj.getDate(),
      currentObj: currentObj,
      toMonth: 1

    })
    this.setSchedule(currentObj)

    // 获取当前月份的plan数据
    this.getPlanData(planDate)
  },

 /**
  * 用户切换月份，调用的函数
  */
  doDay: function (e) {
    var that = this
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1
      if (m <= 0) {
        str = (Y - 1) + '/' + 12 + '/' + d
      } else {
        str = Y + '/' + m + '/' + d
      }
    } else {
      m += 1
      if (m <= 12) {
        str = Y + '/' + m + '/' + d
      } else {
        str = (Y + 1) + '/' + 1 + '/' + d
      }
    }
    currentObj = new Date(str);
    var dou_YY = currentObj.getFullYear();
    var dou_MM = parseInt((currentObj.getMonth() + 1));
    
    // 判断是否是当前月份
    var today = new Date();
    var toYear = today.getFullYear();
    var toMonth =parseInt((today.getMonth() + 1));
    var isToMonth = 0;
    if (dou_YY == toYear && dou_MM == toMonth ) {
        isToMonth = 1;
    } 

    // 设置当前时间是不是本月
    that.setData({
      toMonth: isToMonth
    })
    if ( dou_MM < 10 ) {
         dou_MM = "0" + dou_MM;
      } 
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + dou_MM + '月',
      currentObj: currentObj
    })
    this.setSchedule(currentObj);

    var douYYYY = currentObj.getFullYear();
    var douMM = (currentObj.getMonth()+1);
    var douDD = currentObj.getDate();
    if (douMM < 10 ) {
        douMM = "0" + dou_MM;
    }
    if (douDD < 10 ) {
        douDD = "0" + douDD;
    }
    var douStr = douYYYY + "-" + douMM + "-" + douDD;

    // 获取当前月份的plan数据
    this.getPlanData(douStr);
  },
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  setSchedule: function (currentObj) {
    var that = this
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    for (var i = 0; i < 42; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = ''
      } else {
        if (f < currentDayNum) {
          currentDayList[i] = f + 1
          f = currentDayList[i]
        } else if (f >= currentDayNum) {
          currentDayList[i] = ''
        }
      }
    }
    that.setData({
      currentDayList: currentDayList
    })
  },

  /**
   * 用户选中日期
   */
  chooseDay: function (day) {
     // 选中下标
     var chooseIndex = day.currentTarget.dataset.index;
     // 选中的天
     var chooseDay = day.currentTarget.dataset.chooseday;

     // 拼接查询的日期
     var currentDate = this.data.currentDate;
     var yea = currentDate.substring(0, 4);
     var mon = parseInt(currentDate.substring(currentDate.indexOf("年") + 1, currentDate.indexOf("月")));
     if (mon <10) {
        mon = "0" + mon;
     }

     chooseDay = chooseDay < 10 ? ("0"+chooseDay)  : chooseDay;

     // 查询日期
     var dateStr = yea + "-" + mon + "-" + chooseDay;

     var dou_arr = this.data.dou_items;
     for(var d = 0; d < dou_arr.length ; d++) {
         dou_arr[d] = "item-content";
     }
     dou_arr[chooseIndex] = "item-content isChoosed";
    this.setData({
       dou_items: dou_arr
    })
     
     // 设置当前日期，页面的数据源
     this.getCurrentData(dateStr);
  },

  /**
   * 根据日期查询当前用户的信息
   */
  getPlanData: function (planDate) {
     var memberId = wx.getStorageSync("memberId");
     var param = {};
     // 暂时测试
    //  memberId = "12769";
    //  planDate = "2018-04-09";
     var obj = this;
     param.memberId = memberId;
     param.planDate = planDate;
     var displayRedDot = [];
     for(var d = 0; d < 42; d++) {
         displayRedDot.push("redDot");
     }
    //  微信请求中，
     wx.request({
       url: 'https://www.ecartoon.com.cn/expertex!list.asp',
       data:{
         json: encodeURI(JSON.stringify(param))
       },
       success: function (res) {
         var xx_items = obj.data.dou_items;

         // 日历中的日期  
         var days = obj.data.currentDayList;
         for (var x=0; x <res.data.items.length; x++){
             var douPlanDate = res.data.items[x].planDate;
             var hasDay = douPlanDate.substring(douPlanDate.length - 2, douPlanDate.length);
             hasDay = parseInt(hasDay);
             for (var y = 0; y < days.length; y++) {
                 if (days[y] == hasDay) {
                    xx_items[y] = "hasPlan";
                    displayRedDot[y] = "displayRedDot";
                 }
             }
         }
         var planDatas = res.data.items;
         obj.setData({
           douDatas : planDatas,
           dou_hasPlan : xx_items,
           dou_display : displayRedDot
         });
 
         // 筛选出查询日期当天的数据
         obj.getCurrentData(planDate);
       }
       
     })

      
  },
  
  /**
   * 用户点击课程名称
   */
  courseAction: function (dou) {
      var courseId = dou.currentTarget.dataset.courseid;
      wx.navigateTo({
        url: '../../pages/planDetail/planDetail?courseId=' + courseId
      })
  },
  

  /**
   * 筛选查询日期的plan数据
   */
  getCurrentData (dateStr) {
    var objx = this;
    var douPlanData = objx.data.douDatas;
    var douPageData = [];
    for (var dx = 0; dx < douPlanData.length; dx++) {
      if (dateStr == douPlanData[dx].planDate) {
        douPageData.push(douPlanData[dx]);
      }
    }
    var hasNoData = douPageData.length == 0 ? 1 : 0;
    var currentPagePlanData = douPageData.length == 0 ? [] : douPageData[0];
    
    // 给对象设值
    objx.setData({
      planData: currentPagePlanData,
      article: currentPagePlanData.memo == undefined ? "" : currentPagePlanData.memo,
      hasNoData: hasNoData
    })

    // 对article进行处理
    wxParse.wxParse('article', 'html', objx.data.article, objx, 5);

    console.log(JSON.stringify(objx.data.article));

  },
  
  /**
  * 用户点击右上角分享
  */
  // onShareAppMessage: function () {

  // },

  /**
   * 跳转到定制计划页面
   */
  gotoDesign_private: function () {
    wx.navigateTo({
      url: '../../pages/private/private',
    })
  }


})