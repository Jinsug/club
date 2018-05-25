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
    
    if(options.activeId){
      this.getActiveDetailByShare(options.activeId, this);
    } else {
      let active = JSON.parse(decodeURI(options.active));
      this.getActiveDetailByIndex(active ,this);
    }
  },

  /**
   * 
   */
  getActiveDetailByIndex: function (active, obj) {
    if (active.result) {
      obj.addResultTips(active);
    } else {
      active.resultImage = 'opacity.png';
    }
    obj.setData({
      active: active
    });
  },

  /**
   * 
   */
  getActiveDetailByShare: function (activeId, obj) {
    wx.request({
      url: 'https://www.ecartoon.com.cn/clubmp!getActiveById.asp',
      data: {
        activeId, activeId
      },
      success: function (res) {
        var active = res.data.active;
        if (active.result) {
          obj.addResultTips(active);
        } else {
          active.resultImage = 'opacity.png';
        }
        obj.setData({
          activeId: activeId,
          active: active
        });
      }
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

  /**
   * 页面转发
   */
  onShareAppMessage: function () {
    var company = this.data.active.target == 'A' || target == 'B' ? '公斤' : '次';
    var targetText = { A: '体重减少', B: '体重增加', C: '运动', D: '运动' };
    var target = this.data.active.days + '天' + targetText[this.data.active.target] + 
      this.data.active.value + company;
    return {
      title: target,
      path: 'pages/activeDetail/activeDetail?activeId=' + this.data.active.id
    }
  },

  /**
   * wxml绑定函数:主页按钮点击绑定(回到主页)
   */
  goHome: function () {
    wx.switchTab({
      url: '../index/index'
    });
  },

  // 参加挑战
  participateIn: function () {
    if(!wx.getStorageSync('memberId')) {
      wx.reLaunch({
        url: '../mine/mine?source=activeDetail&activeId=' + this.data.activeId
      });
      return;
    }

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