var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    club: {
      image: 'opacity.png'
    },
    ticketList: [],
    scroll_box_weight: 0,
    cardList: []
  },
  // 页面加载函数
  onLoad: function () {
    var obj = this;
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findClubById.asp',
      data: {
        id: wx.getStorageSync('clubId')
      },
      success: function(res){
        // console.log(res);
        var default_weight = 50;
        var length = res.data.ticketList ? res.data.ticketList.length : 0;
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
    var obj = this;
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

  },
  // 俱乐部位置
  clubLocation: function(){
    wx.navigateTo({
      url: '../map/map?club=' + encodeURI(JSON.stringify(this.data.club))
    });
  },
  // 拨打电话
  call: function(){
    wx.makePhoneCall({
      phoneNumber: '13657277062'
    });
  },
  // 健身打卡
  signIn: function(){
    // 调用微信扫码接口
    wx.scanCode({
      success: function(res){
        console.log(res);
      }
    });
  },
  // 俱乐部介绍
  clubRemark: function(){
    wx.navigateTo({
      url: '../introduce/introduce?club=' + encodeURI(JSON.stringify(this.data.club))
    });
  },
  // 会员排名
  memberRanking: function(){
    wx.navigateTo({
      url: '../memberRanking/memberRanking?memberRanking=' + 
        encodeURI(JSON.stringify(this.data.club.memberRanking))
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
    var obj = this;
    // 获取用户选择的优惠券
    var index = e.currentTarget.dataset.index;
    var ticketList = obj.data.ticketList;
    var ticket = ticketList[index];
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
  getOneCardDetail: function(){

  }
})
