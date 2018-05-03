Page({
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    tickets: [
      { id: 19, price: 90, contant: '满1000元使用', state: 0, background: '#FF9800' },
      { id: 20,price: 200, contant: '满2000元使用', state: 0, background: '#FF9800' },
      { id: 21,price: 300, contant: '满3000元使用', state: 0, background: '#FF9800' }
    ],
    defaultClubId: 290,
    club: {},
    background_position: 0
  },
  // 页面加载函数
  onLoad: function () {
    var obj = this;
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findClubById.asp',
      data: {
        id: obj.data.defaultClubId
      },
      success: function(res){
        obj.setData({
          club: res.data.club
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
        clubId: obj.data.defaultClubId
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

  },
  // 会员排名
  memberRanking: function(){

  },
  // 健身直播
  live: function(){

  },
  // 领券
  getTicket: function(e){
    var obj = this;
    // 获取用户选择的优惠券
    var index = e.currentTarget.dataset.index;
    var tickets = obj.data.tickets;
    var ticket = tickets[index];
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
            ticket.background = '#F0F0F2';
            obj.setData({
              tickets: tickets
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
