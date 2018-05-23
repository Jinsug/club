Page({

  /**
   * 页面的初始数据
   */
  data: {
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
   * wxml绑定函数: 商品列表点击绑定
   */
  selectProduct: function (e) {
    var index = e.currentTarget.dataset.index;
    var cardList = this.methods.clearSelected(this.data.cardList, this);
    cardList[index].selectImage = this.data.selectImage;
    this.setData({
      index: index,
      cardList: cardList
    });
  },

  /**
   * 自定义函数
   */
  methods: {
    // 加载俱乐部数据
    getClubData: function (obj) {
      wx.request({
        url: 'https://www.ecartoon.com.cn/clubmp!findClubById.asp',
        data: {
          id: wx.getStorageSync('clubId')
        },
        success: function (res) {
          var cardList = obj.methods.clearSelected(res.data.cardList, obj);
          // 选中时显示的图片
          cardList[obj.data.selectIndex].selectImage = obj.data.selectImage;
          obj.setData({
            cardList: cardList
          });
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
    }

  }
})