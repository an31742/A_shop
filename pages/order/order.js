import { ml_requestOrdersAll } from '../../request/request-pay'
import { ml_showLoading, ml_hideLoading } from '../../utils/asyncWx'
Page({
  data: {
    tabs: [
      {
        id: 1,
        title: '全部',
        isActive: true
      },
      {
        id: 2,
        title: '待付款',
        isActive: false
      },
      {
        id: 3,
        title: '待收货',
        isActive: false
      },
      {
        id: 4,
        title: '退款/退货',
        isActive: false
      }
    ],
    orders: [],
    orders_obj: {}, // 负责全部数据保存到本地的\
    type: 1
  },

  // onLoad(options) {
  //   let { type } = options
  //   console.log('订单', type)

  //   // 切换tab 高亮
  //   this.toggleActiveById(type)
  //   // 获取数据
  //   this.getOrdersById(type)
  // },
  onShow() {
    //1.获取小程序的页面栈
    var curPages = getCurrentPages()
    console.log('页面栈', curPages)
    //2. 拿到当前页面
    let currentPage = curPages[curPages.length - 1]
    console.log('当前页面', currentPage)

    //3. 获取参数 type
    let { type } = currentPage.options

    console.log('订单参数', type)

    // 切换tab 高亮
    this.toggleActiveById(type)
    // 获取数据
    this.getOrdersById(type)
  },

  // 点击tab栏
  clickTabs(e) {
    console.log('order接收到的id', e.detail)
    let id = e.detail

    this.toggleActiveById(id)
    this.getOrdersById(id)
  },
  // 切换高亮状态
  toggleActiveById(id = 1) {
    //1. 解构
    let { tabs } = this.data

    //2. 遍历tabs 设置高亮/排他
    tabs.forEach(v => {
      if (v.id == id) {
        v.isActive = true
      } else {
        v.isActive = false
      }
    })

    //3. 赋值
    this.setData({
      tabs
    })
  },
  // 获取对应的数据
  async getOrdersById(id = 1) {
    // 0. 尝试从本地获取对象
    let orders_obj = wx.getStorageSync('orders')

    // 0.5 判断
    if (!orders_obj[id]) {
      await ml_showLoading()

      //1. 发送请求
      let res = await ml_requestOrdersAll(id)
      console.log('订单数据', res)

      //2. 解构 拿到对象
      let { orders_obj } = this.data
      orders_obj[id] = res.data.message.orders

      await ml_hideLoading()

      // 3. 保存到data里面
      this.setData({
        orders_obj,
        type: id
      })

      //4. 保存到本地
      wx.setStorageSync('orders', orders_obj)
    } else {
      // 有值就直接用
      this.setData({
        orders_obj,
        type: id
      })
    }
  }
})

/**
 *  id   ordres
 *  1 => orders : [666,664....]
 *  2 => orders : [657, 656.....]
 *  3 => order  : [666, 665....]
 *  4 => orders : []
 *
 *  保存一个对象
 *  orders_obj = {
 *    1 : orders,
 *    2 : orders ,
 *    3 : orders ,
 *    4 : orders
 *
 * }
 *
 */
