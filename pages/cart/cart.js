// pages/cart/cart.js
import {
  ml_chooseAddressByPhone,
  ml_getSetting,
  ml_openSetting,
  ml_showModal,
  ml_showToast
} from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressDetail: {},
    isAddress: false,
    carts: [], // 本地购物车数据
    allChecked: true, // 全选的选中状态
    totalCount: 0, // 结算总数量
    totalPrice: 0 // 合计的总价格
  },

  onShow() {
    this.loadCartsFromStorage()
    this.getStorAddr()
  },
  onHide() {
    wx.setStorageSync('cart', this.data.carts)
  },
  onUnload() {
    wx.setStorageSync('cart', this.data.carts)
  },
   // 跳转到支付页面
   async jump2pay() {
    //1. 解构
    let { addressDetail, carts } = this.data

    //2. 判断 地址
    if (!addressDetail.userName) {
      await ml_showToast('没有收货地址')
      return
    }

    //3.判断 过滤出来选中的商品 0
    carts = carts.filter(v => v.isChecked)
    if (carts.length == 0) {
      await ml_showToast('没有可支付的商品')
      return
    }

    //4. 跳转到支付页面
    // navigator => 声明式导航
    // js 跳转   => 编程式导航
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },
   // 从本地存储中 获取购物车数据
  loadCartsFromStorage() {
    //1. 获取
    let carts = wx.getStorageSync('cart') || []

    //2. 保存到data里面去
    this.setData({
      carts
    })

    //3. 重置
    this.ml_setCart(carts)
  },
  //从本地获取本地地址
  getStorAddr() {
    let addr = wx.getStorageSync('address')
    if (!addr) return

    this.setData({
      addressDetail: addr
    })
  },
  //掉接口获取本地地址
  async chooseAddress() {
    let res = await ml_chooseAddressByPhone()
    let addr = res.cityName + res.countyName + res.detailInfo
    res.addr = addr
    this.setData({
      addressDetail: res,
      isAddress: true
    })
    wx.setStorageSync('address', res)
  },


  //---------------------------------------购物车逻辑--------------------------------------------------
  //第一步给点击收货按钮增加权限
  async clickChooseAddressButton() {
    //这个是否获取过微信中的权限   
    //undefined=>就没有允许过也没有拒绝过
    //true => 允许过  
    //false =>拒绝过
    //当获取地址拒绝过需要手动打开权限
    let res = await ml_getSetting()
    console.log("res", res)
    //如果现在处于拒绝的状态就打开权限
    if (res.authSetting["scope.address"] === false) {
      await ml_openSetting()
      //当我打开权限会自动再次进入这个判断
    } else {
      this.chooseAddress()
    }

  },
  //第三步点击+ 和-
  async addCount(e) {
    let { carts } = this.data
    let { count, id } = e.currentTarget.dataset

    let goods = carts.find(v => v.goods_id === id)



    if (goods.goods_num === 1 && count === -1) {

      let { confirm } = await ml_showModal()
      console.log("confirm", confirm)
      if (confirm) {
        carts = carts.filter(v => v.goods_id !== id)
      }
    } else {
      goods.goods_num += count
    }
    this.setData({
      carts
    })
    this.ml_setCart(carts)
  },
  //第四步多选和全选
  handleCheckboxChange(e) {
    let { carts } = this.data
    let { id } = e.currentTarget.dataset

    let goods = carts.find(v => v.goods_id === id)
    goods.isChecked = !goods.isChecked

    this.setData({
      carts
    })
    this.ml_setCart(carts)
  },
  //第五步处理全选由一个决定多个
  handleAllChecked() {
    let { carts } = this.data
    let allChecked = this.data.allChecked

    carts.forEach(v => {
      v.isChecked = !allChecked
    })
    this.setData({
      allChecked: !allChecked,
      carts
    })
    this.ml_setCart(carts)
  },
  //第二步  重构购物车的数据 每一次更改购物车的时候新增商品，更改商品数量都会对下面的总数量和结算数量有一个变化
  ml_setCart(carts) {
    //定义结算和合计
    let totalCount = 0
    let totalPrice = 0
    let newAllChecked = true   //所有商品都是选中的
    carts.forEach(v => {
      console.log(v.isChecked)
      if (v.isChecked) {
        totalCount += v.goods_num
        totalPrice += v.goods_num * v.goods_price
      } else {
        //只要有没有全选就all就不会被选择
        newAllChecked = false
      }

    });
    newAllChecked = carts.length > 0 ? newAllChecked : false
    this.setData({
      totalCount,
      totalPrice,
      allChecked: newAllChecked
    })


  }



})