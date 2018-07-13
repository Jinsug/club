//app.js
App({
  onLaunch: function () {
    // 初始化
    wx.removeStorageSync('memberId');
    wx.setStorageSync('clubId', 290);
  },
   constant: {
    base_pic_url: 'https://www.ecartoon.com.cn/picture',
    base_img_url: 'https://www.ecartoon.com.cn/miniProgram/club/img/',
    isCreateWebSocket: true
  },
  request_url: 'https://www.ecartoon.com.cn/clubmp!'
  
})