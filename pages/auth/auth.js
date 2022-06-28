// pages/auth/auth.js
import { ml_wxlogin, ml_showSuccessToast } from '../../utils/asyncWx'
import { ml_requestToken } from '../../request/request-pay'
Page({
  async getUserInfo(e) {
    //1. 拿到 四个参数
    const { encryptedData, iv, rawData, signature } = e.detail
    console.log(encryptedData, iv, rawData, signature)

    //获取code
    let { code } = await ml_wxlogin()
    console.log("code", code)

    //3. 登录获取token
    let res = await ml_requestToken({
      data: { encryptedData, iv, rawData, signature, code }
    })
    console.log("res00", res)
    //4. 判断
    if (res.data.meta.status === 200) {
      //4.1 保存token到本地
      wx.setStorageSync('token', res.data.message.token)

      await ml_showSuccessToast('授权成功')

      setTimeout(() => {
        //4.2 返回到上一页
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})