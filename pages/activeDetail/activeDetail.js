Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    active: {
      image: 'opacity.png',
      resultImage: 'opacity.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let active = JSON.parse(decodeURI(options.active));
    if(active.result){
      this.addResultTips(active);
    } else {
      active.resultImage = 'opacity.png';
    }
    this.setData({
      active: active
    });
  },

  /**
   * 添加结果相关提示
   */
  addResultTips: function (active) {
    let resultTextList = ['进行中', '成功', '失败', '已结束'];
    let resultImageList = ['201805141535.png', '201805141536.png', '201805141537.png', ''];
    let resultTipList = ['挑战正在进行中，加油！', '恭喜你挑战成功！', '您没达到本次目标，请继续努力！', ''];
    active.resultText = resultTextList[active.result];
    active.resultImage = resultImageList[active.result];
    active.resultTip = resultTipList[active.result];
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

  // 参加挑战
  participateIn: function () {
    let active_data = encodeURI(JSON.stringify(this.data.active));
    wx.navigateTo({
      url: `../joinActive/joinActive?active=${active_data}`
    });
  },

  /**
   *  获取input的值
   */
  getInputValue: function (e) {
    this.setData({
      weight: e.detail.value
    });
  },

  /**
   * 提交挑战体重
   */
  submitWeight: function () {
    // 检查用户是否已经输入
    if(!this.data.weight || this.data.weight == ''){
      return;
    }
    // 提交体重
    let obj = this;
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!submitWeight.asp',
      data: {
        id: this.data.active.orderId,
        weight: this.data.weight
      },
      success: (res) => {
        let active = obj.data.active;
        active.result = res.data.code;
        obj.addResultTips(active);
        obj.setData({
          active: active
        });
      }
    });
  }
})