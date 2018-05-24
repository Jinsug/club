Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: 'https://www.ecartoon.com.cn/picture',
    memberEvaluate: {
      image: 'opacity.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取上个页面的参数
    if(options.signId){
      this.setData({
        signId: options.signId
      });
    }

    // 当前页面加载刷新评论数据
    this.methods.getMemberEvaluate(this);
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
   * 自定义函数
   */
  methods: {
    /**
     * 获取服务端用户评价数据
     */
    getMemberEvaluate: (obj) => {
      wx.request({
        url: 'https://www.ecartoon.com.cn/clubmp!memberEvaluate.asp',
        data: {
          signId: obj.data.signId
        },
        success: (res) => {
          // 渲染页面
          obj.setData({
            memberEvaluate: obj.methods.convertMemberEvaluateScore(res.data.memberEvaluate)
          });
        }
      });
    },
    /**
     * 处理用户评论分数(将百分制转换为5分制,保留原分数)
     */
    convertMemberEvaluateScore: (memberEvaluate) => {
      let scoreTextList = ['差', '一般', '好', '很好', '非常好'];
      let convertScoreToStars = (score) => {
        let stars = [];
        for(let i = 0; i < 5; i++){
          if(i <= score - 1){
            stars.push('201805161040.png');
          } else {
            stars.push('201805161039.png');
          }
        }
        return stars;
      }
      // 将百分制转换为五分制
      memberEvaluate.totalityScoreAsFive = memberEvaluate.totalityScore / 20;
      memberEvaluate.serviceScoreAsFive = memberEvaluate.serviceScore / 20;
      memberEvaluate.deviceScoreAsFive = memberEvaluate.deviceScore / 20;
      memberEvaluate.evenScoreAsFive = memberEvaluate.evenScore / 20;
      // 根据分数计算星星个数
      memberEvaluate.totalityStars = convertScoreToStars(memberEvaluate.totalityScoreAsFive);
      memberEvaluate.serviceScoreStars = convertScoreToStars(memberEvaluate.serviceScoreAsFive);
      memberEvaluate.deviceScoreStars = convertScoreToStars(memberEvaluate.deviceScoreAsFive);
      memberEvaluate.evenScoreStars = convertScoreToStars(memberEvaluate.evenScoreAsFive);
      // 根据分数生成分数文本
      memberEvaluate.serviceScoreText = scoreTextList[memberEvaluate.serviceScoreAsFive - 1];
      memberEvaluate.deviceScoreText = scoreTextList[memberEvaluate.deviceScoreAsFive - 1];
      memberEvaluate.evenScoreText = scoreTextList[memberEvaluate.evenScoreAsFive - 1];
      return memberEvaluate;
    },
    /**
     * 上传图片
     */
    uploadImage: (obj) => {
      let memberEvaluate = obj.data.memberEvaluate;
      let filds = ['evaluateImage1', 'evaluateImage2', 'evaluateImage3'];
      wx.chooseImage({
        count: 3,
        success: (res) => {
          let tempFilePaths = res.tempFilePaths;
          let index = 0;
          let upload = () => {
            wx.uploadFile({
              url: 'https://www.ecartoon.com.cn/esignwx!uploadImage.asp',
              filePath: tempFilePaths[index],
              name: 'memberHead',
              success: (res) => {
                res = JSON.parse(res.data);
                memberEvaluate[filds[index]] = res.image;
                if (index < tempFilePaths.length - 1) {
                  index++;
                  upload();
                } else {
                  // 上传完成后更新页面数据源
                  obj.setData({
                    memberEvaluate: memberEvaluate
                  });
                }
              }
            });
          }
          upload();
        }
      });
    },
    /**
     * 提交评论
     */
    submitEvaluate: (obj) => {
      // 如果未选择评无法提交评论
      if (!obj.data.memberEvaluate.totalityScore || obj.data.memberEvaluate.totalityScore == '' || 
        !obj.data.memberEvaluate.serviceScore || obj.data.memberEvaluate.serviceScore == '' ||
        !obj.data.memberEvaluate.deviceScore || obj.data.memberEvaluate.deviceScore == '' ||
        !obj.data.memberEvaluate.evenScore || obj.data.memberEvaluate.evenScore == ''){
        // 提示用户
        wx.showModal({
          title: '提示',
          content: '请对当前俱乐部评分',
          showCancel: false
        });
        return;
      }
      // 如果未填评论则不能提交
      if (!obj.data.memberEvaluate.evalContent || obj.data.memberEvaluate.evalCountent == ''){
        wx.showModal({
          title: '提示',
          content: '请输入评论内容再提交评论',
          showCancel: false
        });
        return;
      }
      // 向服务端提交评论
      wx.request({
        url: 'https://www.ecartoon.com.cn/clubmp!memberEvaluateToClub.asp',
        data: {
          json: encodeURI(JSON.stringify(obj.data.memberEvaluate))
        },
        success: (res) => {
          if(res.data.success){
            // 重新刷新用户评论数据
            obj.methods.getMemberEvaluate(obj);
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            });
          }
        }
      });
    }
  },
  /**
   * wxml绑定函数:总分星星图片点击绑定
   */
  saveTotalityScore: function (e) {
    let index = e.currentTarget.dataset.index;
    let memberEvaluate = this.data.memberEvaluate;
    memberEvaluate.totalityScore = (index + 1) * 20;
    this.setData({
      memberEvaluate: this.methods.convertMemberEvaluateScore(memberEvaluate)
    });
  },
  /**
   * wxml绑定函数:设备星星图片点击绑定
   */
  saveDeviceScore: function (e) {
    let index = e.currentTarget.dataset.index;
    let memberEvaluate = this.data.memberEvaluate;
    memberEvaluate.deviceScore = (index + 1) * 20;
    this.setData({
      memberEvaluate: this.methods.convertMemberEvaluateScore(memberEvaluate)
    });
  },
  /**
   * wxml绑定函数:环境星星图片点击绑定
   */
  saveEvenScore: function (e) {
    let index = e.currentTarget.dataset.index;
    let memberEvaluate = this.data.memberEvaluate;
    memberEvaluate.evenScore = (index + 1) * 20;
    this.setData({
      memberEvaluate: this.methods.convertMemberEvaluateScore(memberEvaluate)
    });
  },
  /**
   * wxml绑定函数:服务星星图片点击绑定
   */
  saveServiceScore: function (e) {
    let index = e.currentTarget.dataset.index;
    let memberEvaluate = this.data.memberEvaluate;
    memberEvaluate.serviceScore = (index + 1) * 20;
    this.setData({
      memberEvaluate: this.methods.convertMemberEvaluateScore(memberEvaluate)
    });
  },
  /**
   * wxml绑定函数:评价输入框输入绑定
   */
  saveEvaluateText: function (e) {
    let value = e.detail.value;
    let memberEvaluate = this.data.memberEvaluate;
    memberEvaluate.evalContent = value;
    this.setData({
      memberEvaluate: memberEvaluate
    });
  },
  /**
   * wxml绑定函数:上传图片按钮点击绑定
   */
  chooseImage: function () {
    // 调用上传图片函数
    this.methods.uploadImage(this);
  },
  /**
   * wxml绑定函数:发布按钮点击绑定
   */
  saveEvaluate: function () {
    // 调用提交评论函数
    this.methods.submitEvaluate(this);
  }
})