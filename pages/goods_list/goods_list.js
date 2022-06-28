// pages/goods_list/goods_list.js
import { ml_requestListData } from '../../request/request'
import {
  ml_showLoading,
  ml_hideLoading,
  ml_showToast
} from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 1,
        title: '综合',
        isActive: true
      },
      {
        id: 2,
        title: '销量',
        isActive: false
      },
      {
        id: 3,
        title: '价格',
        isActive: false
      }],
      list: [],
      _page: 0, // 初始页 0
      hasMore: true // 默认开始是有值的
  },
  //子传父的第一步
  // 父准备好一个方法
  toggleTab(e) {
    // console.log('父的方法被调用了', e)
    //1. 接收过来的id
    console.log("e",e)
    let id = e.detail

    //2. 遍历排他
    let { tabs } = this.data
    tabs.forEach(v => {
      if (v.id === id) {
        v.isActive = true
      } else {
        v.isActive = false
      }
    })

    //3. 修改tabs
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
      console.log(query)
      const { cat_id, cat_name } = query
      this.cat_id = cat_id
      wx.setNavigationBarTitle({
        title: cat_name
      })
  
      // 调用请求列表数据
      this.loadListData()
  },
 async loadListData(){
  await ml_showLoading()
    //N拿到list在加加
     let {_page ,list }=this.data
     _page++
    // 掉接口 如果有数据就隐藏掉加载动画
     let res = await ml_requestListData(this.cat_id, _page)
     console.log('列表数据', res)
     await ml_hideLoading()

     // 停止刷新
     wx.stopPullDownRefresh()
 
     this.setData({
       list: [...list, ...res.goods],
       _page,
       hasMore: _page < Math.ceil(res.total / 10)
     })
  },

  // async loadListData(){
  //   //加载
  //   await ml_showLoading()

  //  let {_page,list}= this.data
  //  _page++
  //  //每掉一次接口就增加一页
  //  let res = await ml_requestListData(this.cat_id, _page)
  // await ml_hideLoading()  //去掉下拉加载框
  //  this.setData({
  //   list: [...list, ...res.goods],
  //   _page,
  //   hasMore: _page < Math.ceil(res.total / 10)
  //  })

  // },
    // 上拉刷新
    async onReachBottom() {
      //1. 解构
      let { hasMore } = this.data
  
      //2. 判断 没有值了 提示
      if (!hasMore) {
        await ml_showToast('没有更多商品了~~~')
        return
      }
  
      console.log('上拉刷新')
  
      this.loadListData()
    },
    //上拉刷新就是重新加载新的页面
    // onReachBottom(){
    //   //1结构赋值
    //   let {hasMore} =this.data
    //   if (!hasMore) {
    //     await ml_showLoading("没有更多商品了")
    //   }
    //   // 每一次上拉刷新都会增加对应的多少条数据
    //   this.loadListData()
    // }

    // 下拉刷新
    onPullDownRefresh() {
      console.log('下拉刷新')
      //1. 重置
      this.setData({
        list: [],
        _page: 0,
        hasMore: true
      })
      //2. 再请求
      this.loadListData()
    }
  //下拉刷新就是当我下拉的时候
  // // 重新重置
  // onPullDownRefresh(){
  //    this.setData({
  //       list:[],
  //       _page:0,
  //       hasMore:true
  //    })
  //    this.loadListData()
  // }

  })





