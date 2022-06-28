const BASE_URL1 = 'https://uinav.com/api/public/v1'
const BASE_URL = 'http://api-hmugo-web.itheima.net/api/public/v1'

function fetch(options) {
  //1. 创建 promise实例
  const p = new Promise((resolve, reject) => {
    wx.request({
      // 接口
      url: BASE_URL + options.url,
      // 参数
      data: options.data || {},
      // 请求头
      header: options.header || {},
      // 请求方式
      method: options.method || 'GET',
      // 请求成功
      success: res => {
        if (res.data.meta.status === 200) {
          resolve(res.data.message)
        }
      },
      // 失败
      fail: err => {
        reject(err)
      }
    })
  })
  //2. 返回 promise实例
  return p
}

export default fetch
