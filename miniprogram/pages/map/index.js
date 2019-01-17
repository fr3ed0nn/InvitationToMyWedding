// pages/map/index.js

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
    userInfo: {},
    mainInfo: {}
  },

  markertap(e) {
    db.collection("infos").get({
      success: res => {
        var lng1 = res.data[0].longitude
        var lat1 = res.data[0].latitude
        wx.openLocation({
          latitude: parseFloat(lat1),
          longitude: parseFloat(lng1),
          scale: 18,
          name: res.data[0].hotelname,
          address: res.data[0].hoteladdr,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    db.collection("infos").get({
      success: res => {
        this.setData({
          mainInfo: res.data[0]
        })
      }
    })

    var that = this

    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        db.collection("infos").get({
          success: res => {
            var lng2 = res.data[0].longitude
            var lat2 = res.data[0].latitude
            that.setData({
              lng3: lng2, // 全局属性，用来取定位坐标
              lat3: lat2,
              markers: [{
                iconPath: "/images/nav.png",
                id: 0,
                latitude: lat2, // 页面初始化 options为页面跳转所带来的参数 
                longitude: lng2,
                width: 50,
                height: 50
              }],
            });
          }
        })
      }
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
  // 电话呼叫功能，视情况开启
  // callhe: function(event) {
  //   wx.makePhoneCall({
  //     phoneNumber: this.data.mainInfo.he_tel
  //   })
  // },
  // callshe: function(event) {
  //   wx.makePhoneCall({
  //     phoneNumber: this.data.mainInfo.she_tel
  //   })
  // },
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
        url: '/pages/bless/index'
      });
    }
    // 向右滑动
    if (touchMove - touchDot >= 60 && time < 10) {
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