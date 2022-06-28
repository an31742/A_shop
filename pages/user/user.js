/**
 * 1. 头像 + 昵称
 *  - button + open-type='getUserInfo'
 * 2. 我的订单
 *  - 跳转到订单页面 - 获取参数类型
 *  - onLoad() 可以在形参中获取
 *  - onShow() 通过页面栈
 * 3. 收货地址管理
 *   - 点击进入到微信地址管理
 *   - 保存到地址即可
 * 4. 联系客服
 *   - 官方api : wx.makePhoneCall()
 * 5. 意见反馈
 *   - button - open-type='feedback'
 * 6. 关于我们
 *   - 跳转到关于我们页面, 目前没有产品需求
 * 7. 把应用推荐给其他人
 *   - button - open-type='share'
 *
 */

Page({
  data: {
    userInfo: {}
  },
  startLogin(e) {
    let { userInfo } = e.detail
    console.log(userInfo)
    this.setData({
      userInfo
    })

    wx.setStorageSync('userInfo', userInfo)
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) return
    console.log(userInfo)

    this.setData({
      userInfo
    })
  },
  // 拨开电话
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: '13162003667',
      success: result => {},
      fail: () => {},
      complete: () => {}
    })
  },
  // 点击收货地址按钮
  async clickChooseAddressButton() {
    //1. 获取微信中的权限
    //  清除授权设置 => 清空了
    // undefied => 没有允许过 也没有拒绝过
    // true     => 允许
    // false    => 拒绝
    let res = await ml_getSetting()
    console.log('获取的权限设置', res.authSetting['scope.address'])

    //2. 判断
    // 拒绝的 => 打开设置 手动开启
    if (res.authSetting['scope.address'] == false) {
      await ml_openSetting()
    } else {
      this.chooseAddressByPhone()
    }
  },

  // 获取收货地址 - 通过微信获取
  async chooseAddressByPhone() {
    //1. 获取收货地址
    let addr = await ml_chooseAddressByPhone()

    //2. 拼接成一个详细地址
    let addrStr =
      addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
    addr.addrStr = addrStr

    //3. 把 地址保存到 data 里面
    this.setData({
      addrObj: addr
    })

    //4. 保存到本地
    wx.setStorageSync('address', addr)
  }
})
