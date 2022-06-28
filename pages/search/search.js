import { ml_searchGoods } from '../../request/request-pay'

Page({
  data: {
    searchText: '', // 搜索文本
    goods: [], // 搜索到的商品列表
    isFocus: false
  },
  timerId: -1,

  // 处理 input 数据
  handleInput(e) {
    //1. 收集值
    let val = e.detail.value

    // if (!val.trim()) {
    //   this.setData({
    //     isFocus: false,
    //     goods: []
    //   })
    //   return
    // }

    //2. 保存起来
    this.setData({
      searchText: val,
      isFocus: true
    })

    //3. 发送请求
    clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      this.loadListData(val)
    }, 500)
  },

  // 请求查询的数据
  async loadListData(query) {
    let res = await ml_searchGoods(query)

    console.log('搜索的结果', res)

    this.setData({
      goods: res.data.message
    })

    // 得到结果之后,再来判断
    if (!this.data.searchText.trim()) {
      this.setData({
        isFocus: false,
        goods: []
      })
    }
  },

  // 点击取消
  clickCancel() {
    // 重置
    this.setData({
      searchText: '',
      isFocus: false,
      goods: []
    })
  },
  // 点击右下角完成
  clickDone() {
    wx.navigateTo({
      url: '/pages/XXX/XXX?id=123'
    })
  }
})
