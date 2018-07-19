var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base_picture_url: app.constant.base_pic_url + '/',
    cardList: [],
    selectIndex: 0,
    selectImage: '201805231658.png',
    UnSelectedImage: '201805231659.png'
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
    // 每次页面显示刷新健身卡数据
    this.methods.getClubData(this);
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
  onShareAppMessage: function () {
    var card = this.data.cardList[this.data.selectIndex];
    var shareMember = wx.getStorageSync('memberId');
    return {
      title: card.freeProject,
      path: 'pages/product/product?productId='+ card.id +'&shareMember=' + shareMember,
      imageUrl: this.data.base_picture_url + card.image1
    }
  },

  /**
   * wxml绑定函数: 商品列表点击绑定
   */
  selectProduct: function (e) {
    var index = e.currentTarget.dataset.index;
    this.methods.selectProduct(this.data.cardList, index, this);
  },

  /**
   * 自定义函数
   */
  methods: {
    // 加载俱乐部数据
    getClubData: function (obj) {
      wx.request({
        url: app.request_url + 'findClubById.asp',
        data: {
          id: wx.getStorageSync('clubId')
        },
        success: function (res) {
          obj.setData({
            awardRate: res.data.club.awardRate
          });
          obj.methods.selectProduct(res.data.cardList, obj.data.selectIndex, obj);
        }
      });
    },

    /**
     * 清空选中状态
     */
    clearSelected: function (cardList, obj) {
      // 重置为默认图片
      var resetDefaultImage = function (card) {
        // 未选中显示图片
        card.selectImage = obj.data.UnSelectedImage;
        return card;
      }
      return cardList.map(resetDefaultImage);
    },

    /**
     * 选中商品
     */
    selectProduct: function (cardList, index, obj) {
      cardList = obj.methods.clearSelected(cardList, obj);
      cardList[index].selectImage = obj.data.selectImage;
      obj.setData({
        cardList: cardList,
        selectIndex: index
      });
    }
  }
})