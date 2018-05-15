import regeneratorRuntime from '../../utils/runtime.js';
Page({
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    club: {
      image: 'opacity.png'
    },
    ticketList: [],
    scroll_box_weight: 0,
    cardList: [],
    login_button: true
  },
  // 页面加载函数
  onLoad: function () {
    // 初始化
    wx.setStorageSync('memberId', null);

    // 获取俱乐部信息
    this.getClubData(this);
  },

  // 页面展示 
  onShow: function () {
    // 每次打开首页检查缓存是否已有memberId, 如果有就无需重复登录
    if (wx.getStorageSync('memberId')) {
      this.setData({
        login_button: false
      });
    } else {
      let obj = this;
      wx.login({
        success: (login_token) => {
          obj.setData({
            code: login_token.code
          });
        }
      });
    }
  },

  // 加载俱乐部数据
  getClubData: function(obj){
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findClubById.asp',
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
        // 设置当前页面标题
        wx.setNavigationBarTitle({
          title: res.data.club.name
        });
      }
    });
  },

  // 微信登录
  wechatLogin: function (e) {
    if(e.detail.errMsg == 'getUserInfo:ok'){
      // 获取登录code
      e.detail.code = this.data.code;
      wx.request({
        url: 'https://www.ecartoon.com.cn/clubmp!wechatLogin.asp',
        data: {
          json: JSON.stringify(e.detail)
        },
        success: function (res) {
          console.log(res);
          // 登录成功, 把用户id存入缓存
          if (res.data.success) {
            wx.setStorageSync('memberId', res.data.key);
            wx.setStorageSync('session_key', res.data.session_key);
            wx.setStorageSync('openId', res.data.openid);
          } else {
            // 服务端异常, 提示用户
            wx.showModal({
              title: '提示',
              content: '登录或注册异常,后续功能无法使用,请联系开发人员!',
              showCancel: false
            });
          }
        }
      });
    }
    // 移除登录按钮
    this.setData({
      login_button: false
    });
  },

  // 检查登录状态 
  checkLoginState: function() {
    if(!wx.getStorageSync('memberId')){
      wx.showModal({
        title: '提示',
        content: '您取消了授权，需要在“发现”的小程序页面将“俱乐部小程序”删除，' +
                '重新登录授权才可以体验后续功能',
        showCancel: false,
        success: () => {
          return false;
        }
      });
    } else {
      return true;
    }
  },
  // 申请加入 
  apply: function(){
    // 检查登录
    if (!this.checkLoginState()){
      return;
    }
    // 请求服务器
    let obj = this;
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!request.asp',
      data: {
        memberId: wx.getStorageSync('memberId'),
        clubId: wx.getStorageSync('clubId')
      },
      success: function(res){
        if(res.data.success){
          wx.showToast({
            title: '申请成功',
            icon: 'none'
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
    // 跳转页面
    let club_data = encodeURI(JSON.stringify(this.data.club));
    wx.navigateTo({
      url: `../map/map?club=${club_data}`
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
    if (!this.checkLoginState()) {
      return;
    }
    // 创建微信接口对象
    const wxApi = {
      scanCode: () => {
        return new Promise(function (resolve, reject){
          wx.scanCode({
            success: (code_result) => {
              resolve(code_result);
            }
          });
        });
      },
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
            url: 'https://www.ecartoon.com.cn/clubmp!sign.asp',
            data: {
              json: encodeURI(JSON.stringify(param))
            },
            success: (res) => {
              resolve(res);
            }
          });
        });
      }
    }
    // 签到逻辑
    const sign = async () => {
      // 调用扫码api
      let code_result = await wxApi.scanCode();
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
      // 请求参数
      let param = {
        code: code_result.result,
        memberId: wx.getStorageSync('memberId'),
        clubId: wx.getStorageSync('clubId'),
        longitude: location_result.longitude,
        latitude: location_result.latitude
      }
      // 调用服务端签到接口
      let res = await wxApi.request(param);
      if (res.data.success) {
        wx.showToast({
          title: '签到成功',
          complete: (e) => {
            // 跳转至我的足迹页面
            // wx.navigateTo({
            //   url: ''
            // });
          }
        });
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false
        });
      }
    }
    // 调用签到方法
    sign();
  },
  // 俱乐部介绍
  clubRemark: function(){
    // 挑战页面
    let club_data = encodeURI(JSON.stringify(this.data.club));
    wx.navigateTo({
      url: `../introduce/introduce?club=${club_data}`
    });
  },
  // 会员排名
  memberRanking: function(){
    // 跳转页面
    let memberRanking_data = encodeURI(JSON.stringify(this.data.club.memberRanking));
    wx.navigateTo({
      url: `../memberRanking/memberRanking?memberRanking=${memberRanking_data}` 
    });
  },
  // 健身直播
  live: function(){
    wx.navigateTo({
      url: '../live/live'
    });
  },
  // 领券
  getTicket: function(e){
    // 检查登录
    if (!this.checkLoginState()) {
      return;
    }
    // 请求服务器
    let obj = this;
    // 获取用户选择的优惠券
    let index = e.currentTarget.dataset.index;
    let ticketList = obj.data.ticketList;
    let ticket = ticketList[index];
    // 如何当前优惠券状态为1:已获取,则中止后续操作
    if(ticket.state == 1){
      return;
    }
    // 调用服务端接口给用户生成一条优惠券数据
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!setTicketToMember.asp',
      data: {
        memberId: wx.getStorageSync('memberId'),
        ticketId: ticket.id
      },
      success: function(res){
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
  // 进入健身卡详情
  getOneCardDetail: function(e){
    // 检查登录
    if (!this.checkLoginState()) {
      return;
    }
    // 取出用户点击的索引
    let index = e.currentTarget.dataset.index;
    // 取出相应商品
    let product = this.data.cardList[index];
    // 添加商品类型
    product.productType = 'product';
    // 编码
    product = encodeURI(JSON.stringify(product));
    wx.navigateTo({
      url: `../product/product?product=${product}`
    });
  }
})
