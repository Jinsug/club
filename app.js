//app.js
App({
  onLaunch: function () {
    wx.login({
      success: function(login_token){
        // console.log(login_token);
        wx.setStorageSync('memberId', '12769');
      }
    });
  }
})