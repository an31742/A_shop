// pages/goods_detail/goods_detail.js
import { ml_requestDetailData } from '../../request/request'
import {
  ml_showLoading,
  ml_hideLoading,
  ml_showSuccessToast
} from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let goods_id = options.goods_id
    this.loadDetailData(goods_id)
  },
  async loadDetailData(goods_id) {
    await ml_showLoading()
    let res = await ml_requestDetailData(goods_id)
    await ml_hideLoading()
    this.setData({
      detail: res
    })
  },

 async addCart() {
    //解构赋值
    const {
      goods_id,
      goods_name,
      goods_price,
      goods_small_logo
    } = this.data.detail
    //1判断购物车里面有没有值
    let cart = wx.getStorageSync('cart') || []
    //2尝试从购车车里获取当前商品，判断在不在购物车里面
    let goods = cart.find(v => v.goods_id === goods_id)

    //判断是否有值
    if (!goods) {
      //如果没有值就是添加
      cart.unshift({
        goods_id,
        goods_name,
        goods_price,
        goods_small_logo,
        goods_num: 1,
        isChecked: true
      })
    } else {
      goods.goods_num++
    }
    //4. 保存本地
    wx.setStorageSync('cart', cart)

    //5. 提示框
    await ml_showSuccessToast('加入购物车成功')
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