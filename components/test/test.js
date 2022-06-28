// components/test/test.js
Component({
  options:{
  multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
  msg:String
  },

  /**
   * 组件的初始数据
   */
  data: {
     name:"w昂阿姨",
     obj:{
   desc:"年轻貌美"
     }
  },
  observers:{
    name(newVal){
      console.log("心智",newVal)
    },
    obj(newVal){
      console.log("对象",newVal)
    },
    "obj.desc"(newVal){
      console.log("对象的属性",newVal)
    }
  },
  attached(){
  // this.properties.msg
  console.log("999",this.properties.msg)
  },
  /**
   * 组件的方法列表
   */
  methods: {
     trigger(){
       this.triggerEvent('mytap',"我是子数据")
     },
    handleUpdate(){
    let obj=  this.data.obj
    obj.desc="风韵犹存的李阿姨"
      this.setData({
        name:'李阿姨',
        obj
      })
    }
  }
})
