var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    live: {},
    member: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化页面
    this.methods.init(this);
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
   * wxml绑定函数:上传图片按钮点击绑定
   */
  bindUploadTap: function () {
    // 调用上传图片函数
    this.methods.uploadImage(this);
  },

  /**
   * wxml绑定函数:验证手机号按钮点击绑定
   */
  bindPhoneNumberButtonTap: function (e) {
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      return;
    }
    // 解密手机号
    this.methods.getMobilePhone(e, this);
  },

  /**
   * wxml绑定函数:直播名称输入框输入绑定
   */
  bindLiveNameInput: function (e) {
    var live = this.data.live;
    live.liveName = e.detail.value;
    this.setData({
      live: live
    });
  },

  /**
   * wxml绑定函数:直播价格输入框输入绑定
   */
  bindLiveCostInput: function (e) {
    var live = this.data.live;
    live.liveCost = e.detail.value;
    this.setData({
      live: live
    });
  },

  /**
   * wxml绑定函数:直播公告输入框输入绑定
   */
  bindLiveNoticeInput: function (e) {
    var live = this.data.live;
    live.liveNotice = e.detail.value;
    this.setData({
      live: live
    });
  },

  /**
   * wxml绑定函数:发起直播按钮点击绑定
   */
  bindReleaseLiveButtonTap: function () {
    // 调用发起直播函数
    this.methods.releaseLive(this);
  },

  /**
   * 日期改变绑定函数
   */
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = util.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = util.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  /**
   * 自定义函数
   */
  methods: {
    /**
     * 页面初始化
     */
    init: function (obj) {
      // 获取完整的年月日 时分秒，以及默认显示的数组
      var date1 = util.dateTimePicker(obj.data.startYear, obj.data.endYear);
      var date2 = util.dateTimePicker(obj.data.startYear, obj.data.endYear);
      // 精确到分的处理，将数组的秒去掉
      var lastArray = date1.dateTimeArray.pop();
      var lastTime = date1.dateTime.pop();

      obj.setData({
        dateTime: date1.dateTime,
        dateTimeArray: date1.dateTimeArray,
        dateTimeArray1: date2.dateTimeArray,
        dateTime1: date2.dateTime
      });

      // 请求用户信息
      wx.request({
        url: app.request_url + 'getMemberInfo.asp',
        data: {
          memberId: wx.getStorageSync('memberId')
        },
        success: function (res) {
          obj.setData({
            member: res.data
          });
        }
      });
    },

    /**
     * 上传图片
     */
    uploadImage: function (obj) {
      wx.chooseImage({
        count: 1,
        success: function(res) {
          var tempFilePaths = res.tempFilePaths;
          wx.uploadFile({
            url: 'https://www.ecartoon.com.cn/esignwx!uploadImage.asp',
            filePath: tempFilePaths[0],
            name: 'memberHead',
            success: res => {
              var live = obj.data.live;
              live.liveImage = JSON.parse(res.data).image;
              obj.setData({
                live: live
              });
            }
          });
        }
      });
    },

    /**
     * 解密手机号
     */
    getMobilePhone: function (e, obj) {
      e.session_key = wx.getStorageSync("session_key");
      wx.request({
        url: app.request_url + 'decodePhoneNumber.asp',
        data: {
          json: JSON.stringify(e)
        },
        success: function (res) {
          // 获取和处理用户手机号
          var userPhoneNumber = res.data.phoneNumber;
          var member = obj.data.member;
          member.memberMobilePhone = userPhoneNumber;
          member.mobileValid = 1;
          obj.setData({
            member: member
          });
        }
      })
    },

    /**
     * 发起直播
     */
    releaseLive: function (obj) {
      var member = obj.data.member;
      var dateTimeArray = obj.data.dateTimeArray;
      var dateTime = obj.data.dateTime;
      var param = obj.data.live;
      param.memberId = member.memberId;
      param.mobilephone = member.memberMobilePhone;
      param.mobileValid = member.mobileValid;
      param.startTime = `${dateTimeArray[0][dateTime[0]]}-${dateTimeArray[1][dateTime[1]]}-${dateTimeArray[2][dateTime[2]]} ${dateTimeArray[3][dateTime[3]]}:${dateTimeArray[4][dateTime[4]]}`;
      // 判断参数是否完整
      if (!param.liveImage || param.liveImage == ''){
        wx.showModal({
          title: '提示',
          content: '请上传直播封面',
          showCancel: false
        });
        return;
      }
      if (!param.mobilephone || param.mobilephone == '' || !param.mobileValid || param.mobileValid == ''){
        wx.showModal({
          title: '提示',
          content: '请验证手机号',
          showCancel: false
        });
        return;
      }
      if (!param.liveName || param.liveName == ''){
        wx.showModal({
          title: '提示',
          content: '请输入直播名称',
          showCancel: false
        });
        return;
      }
      if (!param.liveCost || param.liveCost == '') {
        wx.showModal({
          title: '提示',
          content: '请输入价格(免费请写0)',
          showCancel: false
        });
        return;
      }
      if (!param.liveNotice || param.liveNotice == '') {
        wx.showModal({
          title: '提示',
          content: '请输入直播公告内容',
          showCancel: false
        });
        return;
      }
      // 验证通过,请求服务端生成一条直播数据
      wx.request({
        url: app.request_url + 'saveLive.asp',
        data: {
          json: encodeURI(JSON.stringify(param))
        },
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: '您的直播已经发布，请在管理员审核通过后正式开播。如有问题请到小程序首页点击“联系客服”',
            showCancel: false,
            complete: e => {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }
      })
    }
  } 
})