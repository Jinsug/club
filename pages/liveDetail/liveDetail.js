var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: 0,
    live: {},
    activeList: [],
    currentIndex: 0,
    swipertHeight: 0,
    chatHeight: 0,
    chatText: '',
    chatList: [],
    last_chat: '',
    totalOnline: 0,
    isAnchor: false,
    pushing: 0,
    isAll: 0,
    isAllClass: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化
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
    if(wx.getStorageSync('payLive') && wx.getStorageSync('payLive') == 1){
      wx.navigateBack({
        delta: 1
      });
    }
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
   * wxml绑定函数: 直播窗口点击绑定(改变直播操作栏显示/隐藏)
   */
  changeOperation: function () {
    var operation = this.data.operation == 0 ? 1 : 0;
    this.setData({
      operation: operation
    });
  },

  /**
   * wxml绑定函数: 选项卡按钮点击绑定(切换滑块)
   */
  switchSwiper: function (e) {
    var index = e.currentTarget.dataset.index;
    // 切换选项卡状态
    this.methods.changeSwiperIndex(index, this);
  },

  /**
   * wxml绑定函数: 滑块滑动绑定(切换滑块)
   */
  changeSwiper: function (e) {
    if (e.detail.source == 'touch') {
      // 切换选项卡状态
      this.methods.changeSwiperIndex(e.detail.current, this);
    }
  },

  /**
   * wxml绑定函数: 输入框输入绑定
   */
  inputChatText: function (e) {
    this.setData({
      chatText: e.detail.value
    });
  },

  /**
   * wxml绑定函数: 发送按钮点击绑定(发送聊天信息)
   */
  sendChat: function () {
    // 如果输入框为空提示用户
    if(this.data.chatText == ''){
      wx.showModal({
        title: '提示',
        content: '请输入要发送的文本',
        showCancel: false
      });
      return;
    }
    // 给服务端推送一条消息
    var message = {
       memberId: wx.getStorageSync('memberId'),
       memberName: this.data.memberName,
       liveId: this.data.live.id,
       content: this.data.chatText,
       type: 'chat' 
    }
    wx.sendSocketMessage({
      data: encodeURI(JSON.stringify(message))
    });
    // 输入框清空
    this.setData({
      chatText: ''
    });
  },

  /**
   * wxml绑定函数:开始/结束直播按钮点击绑定
   */
  bindLiveButtonTap: function (e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      pushing: status
    });
  },

  /**
   * wxml绑定函数:播放器状态改变绑定
   */
  bindStateChange: function (e) {
    console.log(e);
  },

  /**
   * wxml绑定函数:全屏按钮点击绑定
   */
  bindFullscreenButtonTap: function () {
    var isAll = this.data.isAll == 0 ? 1 : 0;
    var isAllClass = isAll == 0 ? '' : 'isAll';
    this.setData({
      isAll: isAll,
      isAllClass: isAllClass
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
      var live = wx.getStorageSync('live');
      // 判断当前登录用户是否为直播发起者
      var isAnchor = false;
      if (wx.getStorageSync('memberId') == live.memberId) {
        isAnchor = true;
      }
      // 页面加载时计算滑块的高度
      var systemInfo = wx.getSystemInfoSync();
      var height = (systemInfo.windowHeight * (750 / systemInfo.windowWidth));
      var swiperHeight = (height - (450 + 80));
      // 页面初始化滑块默认激活选项
      var activeList = ['swiper-active', ''];
      // 页面加载时计算聊天窗口的高度
      var chatHeight = swiperHeight - ((87 + 39) * (750 / systemInfo.windowWidth));
      // 渲染页面
      var renderView = () => {
        var data = {
          live: live,
          activeList: activeList,
          swiperHeight: swiperHeight,
          chatHeight: chatHeight,
          isAnchor: isAnchor
        }
        if (wx.getStorageSync('chat')) {
          var chatList = obj.data.chatList;
          var totalOnline = obj.data.totalOnline;
          chatList.push(wx.getStorageSync('chat'));
          data.chatList = chatList;
          data.last_chat = 'chat' + (chatList.length - 1);
          data.totalOnline = totalOnline + 1;
        }
        obj.setData(data);
      }
      // 判断当前用户角色决定推流还是播放
      if(wx.getStorageSync('memberId') == live.memberId){
        wx.request({
          url: app.request_url + 'liveUrl.asp',
          data: {
            memberId: wx.getStorageSync('memberId')
          },
          success: (res) => {
            live.pushURL = res.data.url;
            renderView();
          }
        });
      } else {
        wx.request({
          url: app.request_url + 'play.asp',
          data: {
            memberId: wx.getStorageSync('memberId'),
            anchor: live.memberId
          },
          success: (res) => {
            if (res.data.success) {
              live.playURL = res.data.playUrl.RTMP;
              renderView();
            } else {
              // 支付直播费用
              var param = {
                productId: res.data.productId,
                productName: res.data.productName,
                productPrice: res.data.productPrice,
                image: res.data.productImage,
                productType: 'product',
                time: res.data.currentDate
              }
              wx.setStorageSync('payLive', 1);
              wx.navigateTo({
                url: '../order/order?product=' + encodeURI(JSON.stringify(param))
              });
            }
          }
        });
      }

      // 请求用户数据(后续连接webSocket进行聊天)
      wx.request({
        url: app.request_url + 'getMemberInfo.asp',
        data: {
          memberId: wx.getStorageSync('memberId')
        },
        success: function (res) {
          obj.setData({
            memberName: res.data.memberName
          });

          if (app.constant.isCreateWebSocket) {
            // 创建webScoket连接
            wx.connectSocket({
              url: 'wss://www.ecartoon.com.cn/clubMpChat/' + live.id + '/' + wx.getStorageSync('memberId'),
              method: 'GET',
              complete: function () {
                app.constant.isCreateWebSocket = false;
              }
            });
          }

          // 接受服务端传来的消息
          wx.onSocketMessage(function (res) {
            var message = JSON.parse(decodeURI(res.data));
            // 人数消息
            if (message.liveId == obj.data.live.id && message.type == 'count') {
              var chat = {
                memberId: message.memeberId,
                memberName: message.memberName,
                content: message.memberName + '进入直播间',
                type: 'system'
              }
              var chatList = obj.data.chatList;
              chatList.push(chat);
              obj.setData({
                totalOnline: message.count,
                chatList: chatList,
                last_chat: 'chat' + (chatList.length - 1)
              });
              // 系统消息保存
              wx.setStorageSync('chat', chat);
            }

            // 接受一条聊天消息并渲染到view中
            if (message.liveId == obj.data.live.id && message.type == 'chat') {
              var chat = {
                memberId: message.memeberId,
                memberName: message.memberName,
                content: message.content,
                type: 'user'
              }
              var chatList = obj.data.chatList;
              chatList.push(chat);
              obj.setData({
                chatList: chatList,
                last_chat: 'chat' + (chatList.length - 1)
              });
            }
          });
        }
      });
    },

    /**
     * 改变滑块激活索引
     */
    changeSwiperIndex: function (index, obj) {
      var activeList = ['', ''];
      activeList[index] = 'swiper-active';
      obj.setData({
        activeList: activeList,
        currentIndex: index
      });
    }
  }
})