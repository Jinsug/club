import regeneratorRuntime from '../../utils/runtime.js';
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    base_picture_url: app.constant.base_pic_url,
    base_img_url: app.constant.base_img_url,
    club: {
      image: 'opacity.png'
    },
    ticketList: [],
    scroll_box_weight: 0,
    cardList: [],
    getPhoneNumber: -1,
    phoneNumber: '',
    timer: {
      text: '健身签到'
    },
    status: 0,
    memberStatus: 0
  },
  // 页面加载函数
  onLoad: function () {
    // 获取俱乐部信息
    this.getClubData(this);
  },

  // 页面展示 
  onShow: function () {
    var obj = this;
    if(wx.getStorageSync('memberId')){
      // 查询用户数据
      wx.request({
        url: app.request_url + 'findMe.asp',
        data: {
          json: encodeURI(JSON.stringify({ memberId: wx.getStorageSync('memberId') }))
        },
        success: (res) => {
          if (res.data.memberData.mobilephone && res.data.memberData.mobilephone != '' &&
            res.data.memberData.mobileValid && res.data.memberData.mobileValid == 1){
            obj.setData({
              phoneNumber: res.data.memberData.mobilephone
            });
          } else {
            obj.setData({
              getPhoneNumber: 1
            });
          }
        }
      });
    }

    if (wx.getStorageSync('memberId')) {
      var obj = this;
      wx.request({
        url: app.request_url + 'checkMemberToClub.asp',
        data: {
          memberId: wx.getStorageSync('memberId'),
          clubId: wx.getStorageSync('clubId')
        },
        success: function (res) {
          obj.setData({
            memberStatus: res.data.status
          });
        }
      });
    }
  },

  /**
   * 监听页面用户下拉事件
   */
  onPullDownRefresh: function () {
    this.getClubData(this);
    wx.stopPullDownRefresh();
  },

  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.club.name + '的小程序',
      path: 'pages/index/index'
    }
  },

  // 加载俱乐部数据
  getClubData: function(obj){
    wx.request({
      url: app.request_url + 'findClubById.asp',
      data: {
        id: wx.getStorageSync('clubId')
      },
      success: function (res) {
        let default_weight = 50;
        let length = res.data.ticketList ? res.data.ticketList.length : 0;
        obj.setData({
          club: res.data.club,
          ticketList: res.data.ticketList,
          scroll_box_weight: default_weight * length,
          cardList: res.data.cardList
        });
        wx.setStorageSync('club', res.data.club);
        wx.setStorageSync('cardList', res.data.cardList);
        // 设置当前页面标题
        wx.setNavigationBarTitle({
          title: res.data.club.name
        });
      }
    });
  },

  // 上报formId
  submitApply: function (e) {
    var objx = this;
    wx.setStorageSync('sourceFormId', e.detail.formId);
    objx.apply();
  },

  // 申请加入 
  apply: function(){
    // 检查登录
    if (!wx.getStorageSync('memberId')){
      wx.reLaunch({
        url: '../mine/mine?source=index'
      });
      return;
    }
    // 请求服务器
    let obj = this;
    wx.request({
      url: app.request_url + 'request.asp',
      data: {
        memberId: wx.getStorageSync('memberId'),
        clubId: wx.getStorageSync('clubId')
      },
      success: function(res){
        if(res.data.success){
          obj.uploadFormId(res.data.msgId);
          wx.showModal({
            title: '提示',
            content: '您的加入申请已经发送给俱乐部，请等候俱乐部审批',
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          });
        }
      }
    });
  },

  // 将formId保存到服务器端
  uploadFormId: function (type_id) {
    var objx = this;
    var param = {};
    param.source = wx.getStorageSync('sourceFormId');
    param.openid = wx.getStorageSync('openId');
    param.memberId = wx.getStorageSync('memberId');
    param.clubId = wx.getStorageSync('clubId');
    param.type = 'apply';
    param.type_id = type_id;
    wx.request({
      url: app.request_url + 'uploadFormId.asp',
      data: {
        json: encodeURI(JSON.stringify(param))
      },
      dataType: JSON,
      success: function (res) {
        res = JSON.parse(res.data);
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

  
  relieve: function () {
    var obj = this;
    wx.request({
      url: app.request_url + 'saveRelieve.asp',
      data: {
        memberId: wx.getStorageSync('memberId'),
        clubId: wx.getStorageSync('clubId')
      },
      success: function (res) {
        if (res.data.success) {
          wx.showModal({
            title: '提示',
            content: '解除成功!',
            showCancel: false
          });
          obj.setData({
            memberStatus: 0
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          });
        }
      }
    });
  },
  // 联系客服
  contactService: function(){
    // 暂时不需要js操作
  },
  // 俱乐部位置
  clubLocation: function(){
    /**
     * 转换俱乐部列表数据中的坐标为腾讯系坐标(弃用)
     */
    var convertPoint = (club) => {
      // 调用util方法进行坐标转换(百度坐标系转换为腾讯坐标系)
      var point = util.MapabcEncryptToBdmap(club.latitude, club.longitude);
      console.log(point);
      club.latitude = point.lat;
      club.longitude = point.lng;
      return club;
    }

    // 去地图中
    var clubList = [this.data.club];
    wx.setStorageSync('clubList', clubList);
    wx.navigateTo({
      url: '../map/map'
    });
  },
  // 拨打电话
  call: function(){
    // 调用微信小程序拨打电话接口
    wx.makePhoneCall({
      phoneNumber: this.data.club.mobilephone
    });
  },
  // 健身打卡
  signIn: function(){
    // 检查登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=index'
      });
      return;
    }
    // 创建微信接口对象ss
    const wxApi = {
      getLocation: () => {
        return new Promise(function (resolve, reject){
          wx.getLocation({
            success: (location_result) => {
              resolve(location_result);
            },
            fail: (e) => {
              resolve({ refuse: true });
            }
          });
        });
      },
      showModal: (content) => {
        return new Promise(function (resolve, reject){
          wx.showModal({
            title: '提示',
            content: content,
            success: (operation) => {
              resolve(operation);
            }
          });
        });
      },
      openSetting: () => {
        return new Promise(function(resolve, reject){
          wx.openSetting({
            success: (setting) => {
              if (setting.authSetting["scope.userLocation"]) {
                //这里是授权成功之后 填写你重新获取数据的js
                resolve({ success : true });
              } else {
                // 拒绝授权
                resolve({ success : false });
              }
            }
          });
        });
      },
      request: (param) => {
        return new Promise(function (resolve, reject){
          wx.request({
            url: app.request_url + 'sign.asp',
            data: {
              json: encodeURI(JSON.stringify(param))
            },
            success: (res) => {
              resolve(res);
            }
          });
        });
      },
      getServerTime: function() {
        return new Promise(function (resolve, reject) {
          wx.request({
            url: app.request_url + 'getSignTime.asp',
            data: {
              memberId: wx.getStorageSync('memberId'),
              clubId: wx.getStorageSync('clubId')
            },
            success: function (res) {
              resolve(res);
            }
          });
        });
      },
      getTimer: function (time) {
        var h = Math.floor(time / (60 * 60));
        var hh = time - (h * 60 * 60);
        var m = Math.floor(hh / 60);
        var s = Math.floor(time - (m * 60));
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return h + ':' + m + ':' + s;
      },
      createTimer: function (signTime, obj) {
        var time = signTime.data.time;
        var interval = setInterval(function () {
          var timer = obj.data.timer;
          var status = signTime.data.status;
          timer.timer = wxApi.getTimer(time);
          timer.time = time;
          timer.text = timer.timer;
          timer.start = true;
          obj.setData({
            timer: timer
          });
          if (time == 0) {
            clearInterval(interval);
            timer.text = '健身签出';
            timer.start = false;
            obj.setData({
              timer: timer
            });
          }
          time--;
        }, 1000);
      }
    }
    // 检查时间
    if (this.data.timer.time && this.data.timer.time > 0) {
      wx.showModal({
        title: '提示',
        content: '请在' + wxApi.getTimer(this.data.timer.time) + '后签出',
        showCancel: false
      });
      return;
    }

    if(this.data.status != 0){
      return;
    }

    this.setData({
      status: 1
    });

    var obj = this;
    setTimeout(function () {
      obj.setData({
        status: 0
      });
    }, 1000);
    
    // 签到逻辑
    const sign = async () => {
      var obj = this;
      // 调用获取地理位置api
      let location_result = await wxApi.getLocation();
      // 第一次拒绝后重新请求授权
      if (location_result.refuse){
        let content = '您拒绝授权地理位置信息, 需要在设置中打开授权才能继续使用扫码签到功能!';
        let operation = await wxApi.showModal(content);
        if (operation.confirm) {
          let setting = await wxApi.openSetting();
          if (setting.success) {
            location_result = await wxApi.getLocation();
          } else {
            wx.showModal({
              title: '提示',
              content: '您重复拒绝授权地理位置信息,扫码签到功能暂时不可用!',
              showCancel: false
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '您重复拒绝授权地理位置信息,扫码签到功能暂时不可用!',
            showCancel: false
          });
        }
      }
      // 第二次拒绝授权,中止后续操作
      if (location_result.refuse) {
        return;
      }
      // 坐标系转换(弃用)
      // var point = util.MapabcEncryptToBdmap(location_result.latitude, location_result.longitude);
      // 请求参数
      let param = {
        memberId: wx.getStorageSync('memberId'),
        clubId: wx.getStorageSync('clubId'),
        longitude: location_result.longitude,
        latitude: location_result.latitude
      }
      // 调用服务端签到接口
      var signTime = await wxApi.getServerTime();
      // 已经签到签出过
      if(signTime.data.status == 2){
        wx.showModal({
          title: '提示',
          content: '每天只能进行一次签到签出操作',
          showCancel: false
        });
        return;
      }
      // 已经签到但未签出
      if(signTime.data.status == 1 && signTime.data.time > 0){
         // 第一种情况还有剩余时间: 直接创建定时器
         wxApi.createTimer(signTime, this);
         return;
      }
      // 已经签到但未签出
      if(signTime.data.status == 1 && signTime.data.time <= 0){
        // 第二种情况时间限制已经通过: 请求服务端生成签出数据
        let res = await wxApi.request(param);
        if (!res.data.success) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          });
          return;
        }
        if (res.data.sign_out) {
          wx.showModal({
            title: '提示',
            content: '签出成功，请到“我的足迹”对本次服务进行评价',
            showCancel: false,
            complete: () => {
              var timer = obj.data.timer;
              timer.text = '健身签到';
              obj.setData({
                timer: timer
              });
              // 跳转至我的足迹页面
              wx.navigateTo({
                url: '../myFooter/myFooter'
              });
            }
          });
        }
      }
      // 未签到,未签出
      if(signTime.data.status == 0){
        // 先生成签到数据再创建定时器
        let res = await wxApi.request(param);
        if (!res.data.success) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          });
          return;
        }
        if (res.data.sign_out) {
          wx.showModal({
            title: '提示',
            content: '签出成功，请到“我的足迹”对本次服务进行评价',
            showCancel: false,
            complete: () => {
              // 跳转至我的足迹页面
              wx.navigateTo({
                url: '../myFooter/myFooter'
              });
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '签到成功，请在' + signTime.data.totalTime + '分钟后进行签出',
            showCancel: false
          });
          wxApi.createTimer(signTime, this);
        }
        return;
      }
    }
    // 调用签到方法
    sign();
  },

  // 俱乐部介绍
  clubRemark: function(){
    // 挑战页面
    wx.setStorageSync('club', this.data.club);
    wx.navigateTo({
      url: '../introduce/introduce'
    });
  },

  /**
     * 私人订制
     */
  gotoPrivate: function () {
    // 检查登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=index'
      });
      return;
    }
    wx.navigateTo({
      url: '../private/private',
    })
  },

  // 会员排名
  memberRanking: function(){
    wx.navigateTo({
      url: '../memberRanking/memberRanking' 
    });
  },
  // 健身直播
  live: function(){
    var url = '../video/video';
    if (this.data.club.status == 1) {
      url = '../live/live';
    }
    wx.navigateTo({
      url: url
    });
  },
  // 领券
  getTicket: function(e){
    // 检查登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=index'
      });
      return;
    }
    // 请求服务器
    let obj = this;
    // 获取用户选择的优惠券
    let index = e.currentTarget.dataset.index;
    
    ///
    this.setData({
      index: index
    });

    if(this.data.phoneNumber != ''){
      this.setTicket(index);
    }
  },

  /// 
  setTicket: function (index, phoneNumber) {
    var obj = this;
    let ticketList = obj.data.ticketList;
    let ticket = ticketList[index];
    // 如何当前优惠券状态为1:已获取,则中止后续操作
    if (ticket.state == 1) {
      return;
    }
    var param = {
      memberId: wx.getStorageSync('memberId'),
      ticketId: ticket.id
    }
    if(phoneNumber){
      param.phoneNumber = phoneNumber;
    }
    // 调用服务端接口给用户生成一条优惠券数据
    wx.request({
      url: app.request_url + 'setTicketToMember.asp',
      data: param,
      success: function (res) {
        // 弹窗提示用户
        wx.showModal({
          title: '领取成功',
          content: '您已成功领取优惠券，请在“我的优惠券”中查看。欢迎使用优惠券购买健身卡。',
          showCancel: false,
          complete: function () {
            // 更改优惠券状态
            ticket.state = 1;
            obj.setData({
              ticketList: ticketList
            });
          }
        });
      }
    });
  },

  // 
  getMobilePhone: function(e) {
    if (e.detail.errMsg != 'getPhoneNumber:ok'){
      return;
    }
    var obj = this;
    e.session_key = wx.getStorageSync("session_key");
    wx.request({
      url: app.request_url + 'decodePhoneNumber.asp',
      data: {
        json: JSON.stringify(e)
      },
      success: function (res) {
        // 获取和处理用户手机号
        var userPhoneNumber = res.data.phoneNumber;
        obj.setTicket(obj.data.index, userPhoneNumber);
      }
    })
  },

  // 进入健身卡详情
  getOneCardDetail: function(e){
    // 检查登录
    if (!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=index'
      });
      return;
    }
    // 取出用户点击的索引
    let index = e.currentTarget.dataset.index;
    // 取出相应商品
    let product = this.data.cardList[index];
    // 传递下一个页面
    wx.setStorageSync('product', product);
    wx.navigateTo({
      url: '../product/product'
    });
  }
})
