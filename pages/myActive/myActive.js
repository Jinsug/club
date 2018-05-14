Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let obj = this;
    // 添加右上角结果图片
    let addResultImage = (active) => {
      let resultImageList = ['201805141347.png', '201805141348.png',
          '201805141349.png', '201805141350.png'];
      active.resultImage = resultImageList[active.result];
      return active;
    }
    // 请求服务端我的挑战数据
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!findActiveAndDetailByMember.asp',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: (res) => {
        obj.setData({
          activeList: res.data.activeList.map(addResultImage)
        });
      }
    });
  },

  /**
   * 点击挑战列表触发
   */
  tapActiveItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let active_data = encodeURI(JSON.stringify(this.data.activeList[index])); 
    wx.navigateTo({
      url: `../activeDetail/activeDetail?active=${active_data}`
    });
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