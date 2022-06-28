// components/search-header/search-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  tabs:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
     
  },

  /**
   * 组件的方法列表
   */
  methods: {
     // 切换 tab
     clickTab(e) {
       console.log("点击切换")
      // console.log('切换tab', e.currentTarget.dataset.id)
      let id = e.currentTarget.dataset.id
      // 子传父 第三步 : 子触发自定义事件
      this.triggerEvent('mytap', id)
    }
  }
})
