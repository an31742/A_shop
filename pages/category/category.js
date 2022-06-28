// pages/category/category.js
import { ml_requestCatesData } from '../../request/request'
import { ml_showLoading, ml_hideLoading } from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cates:[],
    selectIndex: 0,
    leftMenusData: [],
    rightMenusData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(2222)
    let localCates = wx.getStorageSync('cates')  //是否有对象
    if (localCates) {
      console.log(4444)
      //2.1 判断是否过期
      // 10s = 10 * 1000
      // 7天 = 7 * 24 * 60 * 60 * 1000
      let isLate = Date.now() - localCates.time > 10 * 1000
      if (isLate) {
        console.log(7777, localCates)
        this.cates=localCates.data
        //2. 处理左右侧需要的数据
        let leftMenusData = localCates.data.map(v => v.cat_name)
        let rightMenusData = localCates.data[0].children
        //3. 保存到data里面
        this.setData({
          cates:localCates,
          leftMenusData,
          rightMenusData
        })
      }
    } else {
      console.log(1111)
      this.loadCatesData()
    }
  },
  // 发送请求 获取分类数据
  async loadCatesData() {
    try {
      // 显示加载框
      await ml_showLoading()
      //1. 请求数据
      let res = await ml_requestCatesData()
      console.log("res", res)
      this.cates=res
      // 隐藏加载框
      await ml_hideLoading()
      // 保存到本地
      wx.setStorageSync('cates', {
        data: res,
        time: Date.now()
      })
      this.cates = res
      //2. 处理左右侧需要的数据
      let leftMenusData = this.cates.map(v => v.cat_name)
      let rightMenusData = this.cates[0].children
      //3. 保存到data里面
      this.setData({
        leftMenusData,
        rightMenusData
      })
    } catch (error) {
      // 隐藏加载框
      await ml_hideLoading()
    }
  },
  handLeft(e) {
    let index = e.currentTarget.dataset.index
    console.log("index",index)
    let rightMenusData = this.cates[index].children
    console.log("rightMenusData",rightMenusData)
    this.setData({
      selectIndex: index,
      rightMenusData: rightMenusData
    })
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