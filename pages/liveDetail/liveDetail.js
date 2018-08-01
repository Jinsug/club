var app = getApp();
var webim = require('../../utils/webim.js');
var webimhandler = require('../../utils/webim_handler.js');
var tls = require('../../utils/tls.js');

var Config = {
  sdkappid: 1400037025,
  accountType: 884,
  //帐号模式，0-表示独立模式，1-表示托管模式
  accountMode: 1 
};

tls.init({
  sdkappid: Config.sdkappid
})

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
    if (!this.data.chatText) {
      return;
    };
    // 推送一条消息
    var content = this.data.chatText;
    webimhandler.onSendMsg(content);
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
    console.log("播放状态:" + JSON.stringify(e));
    var codeTips = {
      "2006": "直播结束",
      "-2301": "网络断连，多次连接无效，请退出小程序重新进入"
    }
    if (codeTips[e.detail.code]) {
      wx.showModal({
        title: '提示',
        content: codeTips[e.detail.code],
        showCancel: false
      })
    }
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
      var chatHeight = swiperHeight - ((87 + 39 + 20) * (750 / systemInfo.windowWidth));
      // 渲染页面
      var data = {
        live: live,
        activeList: activeList,
        swiperHeight: swiperHeight,
        chatHeight: chatHeight,
        isAnchor: isAnchor
      }
      obj.setData(data);

      // 腾讯IM登录
      obj.methods.loginIM(obj);
    },

    /**
     * 腾讯IM登录
     */
    loginIM: function (obj) {
      tls.login({
        success: function (data) {
          obj.setData({
            Identifier: data.Identifier,
            UserSig: data.UserSig
          })
          
          // 初始化腾讯IM
          obj.methods.initIM(obj);
        }
      });
    },

    /**
     * 初始化腾讯IM
     */
    initIM: function (obj) {
      var avChatRoomId = obj.data.live.tribeId;
      webimhandler.init({
        accountMode: Config.accountMode,
        accountType: Config.accountType,
        sdkAppID: Config.sdkappid,
        //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
        avChatRoomId: avChatRoomId,
        selType: webim.SESSION_TYPE.GROUP,
        selToID: avChatRoomId,
        selSess: null //当前聊天会话
      });
      //当前用户身份
      var loginInfo = {
        'sdkAppID': Config.sdkappid, //用户所属应用id,必填
        'appIDAt3rd': Config.sdkappid, //用户所属应用id，必填
        'accountType': Config.accountType, //用户所属应用帐号类型，必填
        'identifier': obj.data.Identifier, //当前用户ID,必须是否字符串类型，选填
        'identifierNick': obj.data.live.currentMemberName, //当前用户昵称，选填
        'userSig': obj.data.UserSig, //当前用户身份凭证，必须是字符串类型，选填
      };

      //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
      var onGroupSystemNotifys = {
        "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
        "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
        "255": webimhandler.onCustomGroupNotify//用户自定义通知(默认全员接收)
      };

      //监听连接状态回调变化事件
      var onConnNotify = function (resp) {
        switch (resp.ErrorCode) {
          case webim.CONNECTION_STATUS.ON:
            //webim.Log.warn('连接状态正常...');
            break;
          case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
            break;
          default:
            webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
            break;
        }
      };

      //监听事件
      var listeners = {
        //选填
        "onConnNotify": webimhandler.onConnNotify, 
        //监听新消息(大群)事件，必填
        "onBigGroupMsgNotify": function (msg) {
          webimhandler.onBigGroupMsgNotify(msg, function (msgs) {
            var chat = {}
            if (msgs.fromAccountNick == '@TIM#SYSTEM') {
              var user = msg[0].elems[0].content.userinfo[0];
              chat = {
                memberName: msgs.fromAccountNick,
                content:  user.NickName + "进入房间",
                type: 'system'
              }
              // 保存当前用户信息
              obj.setData({
                user: user
              });
              // 拉取群信息
              obj.methods.getGroupInfo(obj);
            } else {
              chat = {
                memberName: msgs.fromAccountNick,
                content: msgs.content,
                type: 'user'
              }
            }
            var chatList = obj.data.chatList;
            chatList.push(chat);
            obj.setData({
              chatList: chatList,
              last_chat: 'chat' + (chatList.length - 1)
            });
          })
        }, 
        //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
        "onMsgNotify": webimhandler.onMsgNotify,
        //监听（多终端同步）群系统消息事件，必填
        "onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, 
        //监听群资料变化事件，选填
        "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify
      };

      //其他对象，选填
      var options = {
        //是否访问正式环境，默认访问正式，选填
        'isAccessFormalEnv': true,
        //是否开启控制台打印日志,默认开启，选填
        'isLogOn': true
      };

      if (Config.accountMode == 1) {
        //托管模式
        webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
      } else {
        //独立模式
        //sdk登录
        webimhandler.sdkLogin(loginInfo, listeners, options);
      }
    },

    /**
     * 读取群信息并设置当前在线人数
     */
    getGroupInfo: function (obj) {
      var options = {
        'GroupIdList': [
          obj.data.live.tribeId
        ],
        'GroupBaseInfoFilter': [
          'Type',
          'Name',
          'Introduction',
          'Notification',
          'FaceUrl',
          'CreateTime',
          'Owner_Account',
          'LastInfoTime',
          'LastMsgTime',
          'NextMsgSeq',
          'MemberNum',
          'MaxMemberNum',
          'ApplyJoinOption'
        ],
        'MemberInfoFilter': [
          'Account',
          'Role',
          'JoinTime',
          'LastSendMsgTime',
          'ShutUpUntil'
        ]
      };
      webim.getGroupInfo(
        options,
        function (resp) {
          var totalOnline = resp.GroupInfo[0].MemberList.length;
          obj.setData({
            totalOnline: totalOnline
          });
          // console.log(resp);
        },
        function (err) {
          console.log(err);
        }
      );
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