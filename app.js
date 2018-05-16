//app.js
App({
  onLaunch: function () {
    // 初始化
    wx.setStorageSync('memberId', null);
    wx.setStorageSync('clubId', 290);
  }
})