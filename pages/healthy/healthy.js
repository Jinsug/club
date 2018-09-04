var util = require('../../utils/util.js')
var _this = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    healthy: [
      {
        image: '201809031049.png',
        title: '体质指数 (BMI)',
        text: '请点击“健身打卡”填写您的身体数据。',
        value: 0
      },
      {
        image: '201809031056.png',
        title: '腰臀比 (WHR)',
        text: '请点击“健身打卡”填写您的身体数据。',
        value: 0
      }
    ],
    line: [
      [
        { text: '性别', lineType: 'select' },
        { text: '出生日期', lineType: 'picker', key: 'date' }
      ],
      [
        { text: '身高', lineType: 'input', company: 'cm', key: 'height' },
        { text: '体重', lineType: 'input', company: 'kg', key: 'weight' }
      ],
      [
        { text: '腰围', lineType: 'input', company: 'cm', key: 'waist' },
        { text: '臀围', lineType: 'input', company: 'cm', key: 'hip' }
      ]
    ],
    selectBlocks: [
      { text: '男', code: 'M' },
      { text: '女', code: 'F' }
    ],
    selectIndex: 0,
    model: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this;

    var model = _this.data.model;
    model.date = util.formatTime(new Date());
    _this.setData({
      model: model
    })
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
  onShareAppMessage: function () {

  },

  /**
     * 保存表单数据
     */
  saveFormData: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 'select') {
      this.setData({
        selectIndex: e.currentTarget.dataset.index
      })
    } else {
      var model = this.data.model;
      var key = e.currentTarget.dataset.key;
      model[key] = e.detail.value;
      this.setData({
        model: model
      })
    }
  },

  /**
   * 检查表单
   */
  checkForm: function () {
    var model = this.data.model;
    var paramList = [
      { key: 'height', message: '请输入身高' },
      { key: 'weight', message: '请输入体重' },
      { key: 'waist', message: '请输入腰围' },
      { key: 'hip', message: '请输入臀围' }
    ]

    for (var item of paramList) {
      if (!model[item.key] || model[item.key] == '') {
        wx.showModal({
          title: '提示',
          content: item.message,
          showCancel: false
        })
        return false;
      }
    }

    model.gender = _this.data.selectBlocks[_this.data.selectIndex].code;
    return model;
  },

  /**
   * 计算健康评估
   */
  computeHealthy: function () {
    var model = this.data.model;
    var healthy = this.data.healthy;

    // BMI
    var bmi_messages = [
      '您的体重过轻，请增强营养，加强锻炼。',
      '您的体重正常，健康风险最低，身体健康。',
      '您的体重超重，患病风险正在加大。',
      '您属于肥胖体型，属健康高危人群。',
      '请点击“健身打卡”填写您的身体数据。'
    ];
    var bmi = Math.pow(model.weight / model.height, 2);
    !!!(bmi < 18.5) || (healthy[0].text = bmi_messages[0]);
    !!!(bmi >= 18.5 && bmi < 24) || (healthy[0].text = bmi_messages[1]);
    !!!(bmi >= 24 && bmi < 28) || (healthy[0].text = bmi_messages[2]);
    !!!(bmi >= 28) || (healthy[0].text = bmi_messages[3]);
    !!!(bmi == 0) || (healthy[0].text = bmi_messages[4]);
    healthy[0].value = bmi;

    // WHR
    var whr_messages = [
      '您拥有理想的腰臀比，请继续保持！',
      '您的腰臀比偏高，中心性肥胖患病概率较大。',
      '您的腰臀比偏低，请加强营养、科学健身！',
    ];
    var whr = model.waist / model.hip || 0;
    !!!(model.gender == 'M' && whr >= 0.85 && whr <= 0.9) || (healthy[1].text = whr_messages[0])
    !!!(model.gender == 'M' && whr > 0.9) || (healthy[1].text = whr_messages[1])
    !!!(model.gender == 'M' && whr < 0.67 && whr > 0) || (healthy[1].text = whr_messages[2])
    !!!(model.gender == 'F' && whr >= 0.67 && whr <= 0.8) || (healthy[1].text = whr_messages[0])
    !!!(model.gender == 'F' && whr > 0.8) || (healthy[1].text = whr_messages[1])
    !!!(model.gender == 'F' && whr < 0.67 && whr > 0) || (healthy[1].text = whr_messages[2])
    healthy[1].value = whr;

    this.setData({ healthy: healthy });
  },

  /**
   * 提交表单
   */
  submitForm: function () {
    var model = _this.checkForm();
    if (!model) {
      return;
    }
    // 本地计算健康评估
    _this.computeHealthy();

    _this.setData({ status: true });
  }
})