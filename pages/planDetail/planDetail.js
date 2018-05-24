Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var courseId = options.courseId;
      this.setData({
          courseId:courseId
      })

      this.getData();
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // },

  /**
   * 获取当前页面的数据
   */
  getData: function () {
      var obj = this;
      var param = {};
      param.courseId = obj.data.courseId;
      param.memberId = wx.getStorageSync("memberId"); 
      
      // 请求后台数据
      wx.request({
        url: 'https://www.ecartoon.com.cn/expertex!findPlanByCourse.asp',
        data: {
            json: encodeURI(JSON.stringify(param))
        },
        success: function (res) {
           // 从后台取得数据
           if (res.data.success) {
             var dou_time = res.data.sumTime%60;
             if (dou_time == 0) {
                  dou_time = res.data.sumTime/60 + "'" + "00" + "''";
               } else {
                  dou_time = parseInt(res.data.sumTime / 60) + "'" + dou_time + "''";
               }
            
             var actionCount = res.data.items.length;
             var dou_carruli = parseInt(res.data.sumTime/60);
             obj.setData({
                 planDetailData:res.data,
                 dou_time : dou_time,
                 dou_carruli: dou_carruli * 13,
                 actionCount: actionCount
             })
             
           } else {
             console.log("请求失败！");
           }
        }
      })
  },

  reminder: function () {
      wx.showModal({
        title: '提示',
        content: '请前往应用商店下载"卡库健身"APP查看本计划视频',
      })
  }
})