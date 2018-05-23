import regeneratorRuntime from '../../utils/runtime.js';
var util = require('../../utils/util.js');
Page({
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    base_img_url: 'https://www.ecartoon.com.cn/miniProgram/club/img',
    club: {
      image: 'opacity.png'
    },
    ticketList: [],
    scroll_box_weight: 0,
    cardList: []
  },
  // 页面加载函数
  onLoad: function () {
    // 获取俱乐部信息
    this.getClubData(this);
  },

  // 页面展示 
  onShow: function () {

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
      url: 'https://www.ecartoon.com.cn/clubmp!request.asp',
      data: {
        memberId: wx.getStorageSync('memberId'),
        clubId: wx.getStorageSync('clubId')
      },
      success: function(res){
        if(res.data.success){
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
  // 联系客服
  contactService: function(){
    // 暂时不需要js操作
  },
  // 俱乐部位置
  clubLocation: function(){
    /**
     * 转换俱乐部列表数据中的坐标为腾讯系坐标
     */
    var convertPoint = (club) => {
      // 调用util方法进行坐标转换(百度坐标系转换为腾讯坐标系)
      var point = util.BdmapEncryptToMapabc(club.latitude, club.longitude);
      club.latitude = point.lat;
      club.longitude = point.lng;
      return club;
    }

    // 去地图中
    var clubList = [this.data.club];
    wx.setStorageSync('clubList', clubList.map(convertPoint));
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
        wx.showModal({
          title: '提示',
          content: '签到成功',
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
    wx.setStorageSync('club', this.data.club);
    wx.navigateTo({
      url: '../introduce/introduce'
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
    // 添加商品类型
    product.productType = 'product';
    // 传递下一个页面
    wx.setStorageSync('product', product);
    wx.navigateTo({
      url: '../product/product'
    });
  }
})
