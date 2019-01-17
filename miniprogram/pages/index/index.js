// pages/invitation/index.js
const app = getApp()
const db = wx.cloud.database()
var appid = app.globalData.appid;

//滑动页面
var touchDot = 0; //触摸时的原点  
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = ""; // 记录/清理时间记录

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: "",
    userInfo: [],
    music_url: 'http://www.ytmp3.cn/down/32874.mp3',
    isPlayingMusic: true,
    mainInfo: {}

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    db.collection("infos").get({
      success: res => {
        this.setData({
          mainInfo: res.data[0],
          music_url: res.data[0].music_url,
        })
      }
    })

    //创建动画
    var animation = wx.createAnimation({

      duration: 3600,
      timingFunction: "ease",
      delay: 600,
      transformOrigin: "50% 50%",

    })

    //边旋转边放大
    animation.scale(0.9).translate(10, 10).step();


    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData: animation.export(),
    })


    var that = this

    wx.playBackgroundAudio({
      dataUrl: that.data.music_url,
      title: '咱们结婚吧-齐晨',
      coverImgUrl: ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '我的婚礼邀请函',
      imageUrl: that.data.mainInfo.sharepic,
      path: 'pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },
  play: function(event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.music_url,
        title: '咱们结婚吧-齐晨',
        coverImgUrl: ''
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  // 触摸开始事件
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间  
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function(e) {
    var touchMove = e.touches[0].pageX;
    // 向左滑动  
    if (touchMove - touchDot <= -60 && time < 10) {
      wx.switchTab({
        url: '/pages/photos/index'
      });
    }
  },
  // 触摸结束事件
  touchEnd: function(e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
  }
})