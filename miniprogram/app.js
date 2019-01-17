// app.js
App({
  onLaunch: function() {
    //var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      // wx.login({
      //     success: function () {
      //         wx.getUserInfo({
      //             success: function (res) {
      //                 //console.info(res);
      //                 that.globalData.userInfo = res.userInfo;
      //                 typeof cb == "function" && cb(that.globalData.userInfo)
      //             }
      //         })
      //     }
      // });
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'test', //改为你自己的云开发环境
      })
    }

  },
  onHide: function() {
    wx.pauseBackgroundAudio();
  },
  onShow: function() {
    wx.playBackgroundAudio()
  },
  globalData: {
    userInfo: null,
    appid: 'wx1234567890', //此处改成你自己的小程序appid
    music_url: '',
  }
});