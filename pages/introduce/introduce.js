Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    club: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var club = JSON.parse(decodeURI(options.club));
    // console.log(club); 
    // 处理俱乐部营业日期将1,2,3格式转换为"星期一", "星期二", "星期三"格式
    var week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    var workDateList = club.workDate.split(",");
    club.workDate = "";
    workDateList.forEach(function(item){
      var index = parseInt(item.trim()) - 1;
      club.workDate += week[index] + "&nbsp;";
    });
    // 页面渲染数据
    this.setData({
      club: club
    });
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
    
  }
})