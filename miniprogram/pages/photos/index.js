//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
var appid = app.globalData.appid;

//滑动页面
var touchDot = 0; //触摸时的原点  
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = ""; // 记录/清理时间记录

Page({
  data: {
    userInfo: {},
    slideList: {},
    sharepic: ''
  },
  onLoad: function() {
    var that = this

    db.collection("photos").get({
      success: res => {
        this.setData({
          slideList: res.data[0].lists
        })
      }
    })

    db.collection("infos").get({
      success: res => {
        this.setData({
          sharepic: res.data[0].sharepic
        })
      }
    })

  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  onShareAppMessage: function(res) {
    var that = this;
    //console.log(that.data);
    return {
      title: '我的婚礼邀请函',
      imageUrl: that.data.sharepic,
      path: 'pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
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
        url: '/pages/map/index'
      });
    }
    // 向右滑动
    if (touchMove - touchDot >= 60 && time < 10) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },
  // 触摸结束事件
  touchEnd: function(e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
  }
})