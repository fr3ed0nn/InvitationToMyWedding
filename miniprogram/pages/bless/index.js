// pages/bless/index.js

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
    actionSheetHidden: true,
    zanLog: [],
    zanNum: 0,
    sharepic: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this


    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }

    wx.cloud.callFunction({
      name: 'zanlist',
      success: res => {
        that.setData({
          zanLog: res.result.data,
          zanNum: res.result.data.length,
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
  openActionsheet: function() {
    var self = this;
    self.setData({
      actionSheetHidden: !self.data.actionSheetHidden
    });
  },
  listenerActionSheet: function() {
    var self = this;
    self.setData({
      actionSheetHidden: !self.data.actionSheetHidden
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
    var that = this;
    wx.cloud.callFunction({
      name: 'zanlist',
      success: res => {
        that.setData({
          zanLog: res.result.data,
          zanNum: res.result.data.length,
        })
      }
    })
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
      imageUrl: that.data.sharepic,
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
  bindgetuserinfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      that.setData({
        userInfo: e.detail.userInfo,
        authBtn: false
      })
      var userInfo = e.detail.userInfo;
      var name = userInfo.nickName;
      var face = userInfo.avatarUrl;

      db.collection("zanLogs").add({
        data: {
          user: name,
          nickname: name,
          face: face,
        },
        success: res => {
          wx.showToast({
            title: '多谢您的祝福啦',
            icon: 'none',
            duration: 2000
          })
        },
        fail: res => {
          wx.showToast({
            title: '您的祝福已收到',
            icon: 'none',
            duration: 2000
          })
        }
      })

      wx.cloud.callFunction({
        name: 'zanlist',
        success: res => {
          that.setData({
            zanLog: res.result.data,
            zanNum: res.result.data.length,
          })
        }
      })

    } else {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },

  zan: function(event) {
    var that = this;
    var userInfo = that.data.userInfo;
    var name = userInfo.nickName;
    var face = userInfo.avatarUrl;
    db.collection("zanLogs").add({
      data: {
        user: name,
        nickname: name,
        face: face,
      },
      success: res => {
        wx.showToast({
          title: '多谢您的祝福啦',
          icon: 'none',
          duration: 2000
        })
      },
      fail: res => {
        wx.showToast({
          title: '您的祝福已收到',
          icon: 'none',
          duration: 2000
        })
      }
    })

    wx.cloud.callFunction({
      name: 'zanlist',
      success: res => {
        that.setData({
          zanLog: res.result.data,
          zanNum: res.result.data.length,
        })
      }
    })
  },
  // 触摸开始事件
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // console.log(touchDot)
    // 使用js计时器记录时间  
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function(e) {
    var touchMove = e.touches[0].pageX;
    // 向右滑动
    if (touchMove - touchDot >= 60 && time < 10) {
      wx.switchTab({
        url: '/pages/map/index'
      });
    }
  },
  // 触摸结束事件
  touchEnd: function(e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
  }

})