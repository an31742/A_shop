/**
 * 显示加载框
 */
export const ml_showLoading = () => {
  return new Promise(resolve => {
    wx.showLoading({
      title: 'Loading...',
      mask: true,
      success: resolve
    })
  })
}

/**
 * 隐藏加载框
 */
export const ml_hideLoading = () => {
  return new Promise(resolve => {
    wx.hideLoading({
      success: resolve
    })
  })
}

/**
 * 消息提示框 - 无图标
 */
export const ml_showToast = title => {
  return new Promise(resolve => {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000,
      success: resolve
    })
  })
}

/**
 * 消息提示框 - 成功
 */
export const ml_showSuccessToast = title => {
  return new Promise(resolve => {
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000,
      success: resolve
    })
  })
}

/**
 * 获取收货地址
 */
export const ml_chooseAddressByPhone = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取设置权限
 */
export const ml_getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 打开设置权限
 */
export const ml_openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 显示删除对话框
 */
export const ml_showModal = () => {
  return new Promise(resolve => {
    wx.showModal({
      title: '温馨提示',
      content: '您确定要从购物车删除商品吗?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: resolve
    })
  })
}
/**
 *  wx.login 封装
 */
export const ml_wxlogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: resolve,
      fail: reject
    })
  })
}

/**
 *  跳转
 */
export const ml_navigateTo = url => {
  return new Promise(resolve => {
    wx.navigateTo({
      url: url,
      success: resolve
    })
  })
}
