// app.js
App({
  onLaunch() {
    console.log("on-launch")
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  },


    // 2. 应用 被用户看到
  // onShow() {
  //   // 对应用的数据或者页面效果 重置
  //   console.log('onShow')
  // },

  // 3. 应用被隐藏
  // onHide() {
  //   // 暂停或者清除定时器
  //   console.log('onHide')
  // },


})
