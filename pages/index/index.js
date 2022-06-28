// index.js
// 获取应用实例

import {
  ml_requestSwipersData,
  ml_requestMenusData,
  ml_requestFloorsData

} from '../../request/request'
Page({
  data: {
    swiperData: [],
    menusData: [],
    floorsData:[]
  },
  onLoad() {
    this.getml_requestSwipersData()
    this.getMl_requestMenusData()
    this.getml_requestFloorsData()
  },
  async getml_requestSwipersData() {
    let res = await ml_requestSwipersData()
    this.setData({
      swiperData: res
    })
  },
  async getMl_requestMenusData() {
    let res = await ml_requestMenusData()
    this.setData({
      menusData: res
    })
  },
  async getml_requestFloorsData() {
    let res = await ml_requestFloorsData()
    this.setData({
      floorsData: res
    })
  },
    // 楼层加载
    onPageScroll(e) {
      // console.log('滚动了', e.scrollTop)
  
      if (e.scrollTop >= 300) {
        // 显示
        this.setData({
          isHide: false
        })
      } else {
        this.setData({
          isHide: true
        })
      }
    },
    // 点击滚动到顶部
    go2top() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }

})
