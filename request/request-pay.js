// fetch
// 因为 支付返回的并不都是 res.data.message 所有我单独再来一个fetch

const BASE_URL = 'https://uinav.com/api/public/v1'

function fetch(options) {
  // 如果 options.url 是以  /my 开头的, 添加 token
  if (options.url.startsWith('/my')) {
    options.header = {
      Authorization: wx.getStorageSync('token')
    }
  }

  //1. 创建 promise 实例
  let p = new Promise((resolve, reject) => {
    wx.request({
      // 接口
      url: BASE_URL + options.url,
      // 参数
      data: options.data || {},
      // 请求头
      header: options.header || {},
      // 请求方式
      method: options.method || 'POST', // 小心
      // 请求成功
      success: res => {
        resolve(res)
      },
      // 失败
      fail: err => {
        reject(err)
      }
    })
  })
  //2. 返回promise实例
  return p
}

/**
 *  登录 - 获取用户token
 */
export const ml_requestToken = options => {
  return fetch({
    url: '/users/wxlogin',
    data: options.data
  })
}

/**
 *  创建订单
 */
export const ml_requestCreateOrder = options => {
  return fetch({
    url: '/my/orders/create',
    data: options.data
    // header: options.header
  })
}

/**
 * 预支付
 */
export const ml_request_req_unifiedorder = options => {
  return fetch({
    url: '/my/orders/req_unifiedorder',
    data: options.data
    // header: options.header
  })
}

/**
 * 开始支付
 */
export const ml_requestPayMent = pay => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 查看支付状态
 */
export const ml_requestCheckOrder = options => {
  return fetch({
    url: '/my/orders/chkOrder',
    data: options.data
    // header: options.header
  })
}

/**
 *  历史订单查询
 */
export const ml_requestOrdersAll = type => {
  return fetch({
    url: '/my/orders/all',
    method: 'GET',
    data: { type }
  })
}

/**
 * 商品搜素
 */
export const ml_searchGoods = query => {
  return fetch({
    url: '/goods/qsearch',
    method: 'GET',
    data: { query }
  })
}
