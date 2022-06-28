// pages/pay/pay.js
import {ml_showToast} from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressDetail: {},
    carts: [], // 本地购物车数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let addr = wx.getStorageSync('address')
    let carts = wx.getStorageSync('cart')
    carts = carts.filter(v => v.isChecked)
    this.setData({
      addressDetail: addr,
      carts
    })
    this.ml_setCarts(carts)
  },
  ml_setCarts(carts) {
    let totalCount = 0
    let totalPrice = 0
    carts.forEach(v => {
      totalCount += v.goods_num
      totalPrice += v.goods_num * v.goods_price
    })
    this.setData({
      totalCount,
      totalPrice,
      carts
    })
  },
  /**
   *  开始支付功能-------------------------------------------------
   */
  async startPay() {
    //1. 尝试着从本地获取token
    let token = wx.getStorageSync('token')

    //2. 判断
    if (!token) {
      await ml_showToast('没有token!!')

      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/auth/auth'
        })
      }, 2000)

      return
    }

    //3. 创建订单
    // 3.1 准备参数
    let order_price = this.data.totalPrice
    let consignee_addr = this.data.addrObj.addrStr
    let goods = this.data.carts.map(v => {
      return {
        goods_id: v.goods_id,
        goods_number: v.goods_num,
        goods_price: v.goods_price
      }
    })

    //3.2 创建订单发送请求
    let res1 = await ml_requestCreateOrder({
      data: {
        order_price,
        consignee_addr,
        goods
      }
      // header: {
      //   Authorization: wx.getStorageSync('token')
      // }
    })

    console.log('创建订单', res1)
    const { order_number } = res1.data.message

    // 4. 预支付
    let res2 = await ml_request_req_unifiedorder({
      data: {
        order_number
      }
      // header: {
      //   Authorization: wx.getStorageSync('token')
      // }
    })

    console.log('预支付', res2)
    const { pay } = res2.data.message

    // 5. 开始支付
    await ml_requestPayMent(pay)

    // 6. 查看订单支付状态
    let res3 = await ml_requestCheckOrder({
      data: {
        order_number
      }
      // header: {
      //   Authorization: wx.getStorageSync('token')
      // }
    })

    // 7. 判断
    if (res3.data.meta.status === 200) {
      // 提示
      await ml_showSuccessToast('支付成功')
      // 7.1 从购物车里面移除支付过的商品
      let carts = wx.getStorageSync('cart')
      carts = carts.filter(v => !v.isChecked)
      wx.setStorageSync('cart', carts)

      setTimeout(() => {
        // 7.2 跳转到订单页面
        wx.navigateTo({
          url: '/pages/order/order'
        })
      }, 2000)
    }
  },


})