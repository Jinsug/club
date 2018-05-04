//app.js
App({
  onLaunch: function () {
    wx.login({
      success: function(login_token){
        // console.log(login_token);
        wx.setStorageSync('clubId', '290');
        wx.setStorageSync('memberId', '12769');
      }
    });
  }
})