var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
   * 自定义函数
   */
  methods: {
    /**
     * 页面初始化
     */
    init: function (obj) {
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
      var param = obj.data.live;
      var member = obj.data.member;
      param.memberId = member.memberId;
      param.mobilephone = member.memberMobilePhone;
      param.mobileValid = member.mobileValid;
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
          wx.navigateTo({
            url: '../live/live'
          });
        }
      })
    }
  } 
})