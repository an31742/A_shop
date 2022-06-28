# 购物车列表的几个小问题
- 问题1 : 在详情页添加到购物车里面 , 购车车不更新问题
   - 原因 : 获取购物车数据在 onLoad() 执行的
           但是 cart页面没有被销毁 就没有不会再次加载, 所以onLoad只会执行一次
   - 解决办法 : onLoad => onShow
   - onShow 页面一显示就会触发调用,每次显示该页面就可以拿到最新的数据 

- 问题2 : 购物车多个商品, 底部 (包含结算 总价的) => 文字错乱
   - 原因 : tool是透明的
   - 解决办法 : 设置一个背景颜色 ` background: #fff;`

- 问题3 : 添加多个商品最后一个商品的一个部分被 tool 盖住了
   - 原因 : tool 固定定位 层级变高 把 下面的购物车列表最底下 一部分盖住了
   - 解决办法 :  给后面的内容 + padding-bottom   
   - 具体步骤 : 
    1. 给几个cart 外面套一个父元素 view.carts
    2. 给 carts 添加 padding-bottom

- 问题4 : 最后cart 不需要边框
```css
  .cart:last-child {
    border-bottom: none;
  }
```    

# 收货地址的取消问题
- 情况 : 
 -  第一次点击按获取收货地址的时候 =>弹窗
 - 确定 => 可以获取地址 => 以后都是确定
 - 取消 => 拒绝获取地址 => 以后都是取消

- 参考 => 官网 => api => 开放能力 =>设置 
 - 拿到  wx.getSetting() => 设置权限

```js
// 面试经常问 工作经常用
- 问题 : 你们小程序中 授权设置是处理的? 
   - 答疑 : 首先获取授权设置能力, 它会返回三种, undefied true 和 false
   - undefied 和 true => 继续授权 => 获取地址
   - false => 打开客户端设置页面 => 手动开启(true) => 返回再继续授权 => 获取地址
- 具体代码
```
```js
//1. 获取授权能力
let res = await ml_getSetting()

//2. 判断
if(res.authSetting['scope.address']  === false) {
   await ml_openSetting()
}else {
  // 继续获取地址
  this.chooseAddressByPhone()
}

```

-  要求 : 每个人写三遍 , 要学会演示


# 购物车逻辑
## 1. 购物车选择情况 => 展示出来
1. 在 detail.js 新加商品进去到购物车的时候, 添加一个 isChecked 默认 为true
```js 
  isChecked : true
```
2. 遍历的时候 多选框以 isChecked 为依据 确定显示和取消
```js
    <checkbox-group bindchange="">
      <checkbox checked="{{ item.isChecked }}"></checkbox>
    </checkbox-group>
```
3. 全选
```js
 allChecked : true  // 全选的选中状态

  <checkbox-group bindchange="">
      <checkbox checked="{{ allChecked }}">全选</checkbox>
    </checkbox-group>
```

## 2. 重新计算 结算+合计
```js
2.1 定义一个方法 ml_setCart(carts) 这个方法后面很常用
2.2 页面一进来就要重新计算一次
    在获取本地购物车数据之后, 立马调用 ml_setCart(carts)
2.3 在方法里面计算
let totalCount = 0;
let totalPrice = 0

carts.forEach(v => {
  if(v.isChecked) {
    totalCount += v.goods_num,
    totalPrice += v.goods_num * v.goods_price
  }
})

2.4 在 data 里面给个初始值 
2.5 获取了总计之后重新赋值
this.setData({
  totalCount,
  totalPrice
})
2.6 wxml 中使用
```

## 3. 处理 点击 + 和 点击 -
- 3.1 给+ 和 - 都注册 addCount 事件, 
- 3.2 传递 参数 id + count
```js
<view bindtap='addCount' data-count='{{ -1 }}' data-id='{{ item.goods_id }}'>-</view>
<view>5</view>
<view bindtap='addCount' data-count='{{ 1 }}' data-id='{{ item.goods_id }}' >+</view>
```
- 3.3 保存 - 和 + 下沉 , 因为 text识别换行, text => view
- 3.4 addCount方法里面
```js
  let { carts } = this.data
  let { count, id} = e.currentTarget.dataset

  let goods = carts.find(v => v.goods_id === id)

  goods.goods_num += count

  this.setData({
    carts  // 更新商品视图
  })

  this.ml_setCart(carts)

```


## 4. 处理当前数量为1, 并且点击-的情况
```js
// 数量为1, 并且 点击了 -
if(goods.goods_num === 1 && count = -1) {
 
  let { confirm } = await ml_showModal()

  if(confirm) {
    carts = carts.filter(v => v.goods_id !== id)
  }
}
```

## 5. 点击商品的多选框
1. 给多选框监听改变事件
2. 传参goods_id参数
3. 根据goods_id 找到对应的商品
4. 拿到商品里面的 isChecked 取反
5. 重新赋值
```js
  handleCheckboxChange(e) {
    //1 解构
    let { carts } = this.data
    let { id } = e.currentTarget.dataset

    //2. 根据 id 从购物车里面 查找对应的商品
    let goods = carts.find(v => v.goods_id === id)

    //3. 取反
    goods.isChecked = !goods.isChecked

    //4. 重新赋值
    this.setData({
      carts
    })

    //5. 重置
    this.ml_setCart(carts)
  },
```

## 6. 全选问题 
####  6.1 下 => 上 
  - 目标 : 点击全选(下) => 让列表中商品的多选框(上)同步勾选
1. 给全选注册 bindchange 事件
2. 拿到当前全选的值
3. 遍历购物车 让购物车里面的商品选择状态全部取反  
4. 重新赋值
```js
let {carts, allChecked} = this.data

carts.forEach( v => {
  v.isChecked = !allChecked
} )

this.setData({
  carts,
  allChecked : !allChecked
})

this.ml_setCart()

```

####  6.2 上 => 下
  - 目标 : 点击商品的多选框(上) => 影响到全选多选框(下)
           商品的多选框都是选中的 => 全选选中
           商品的多选框只要有一个不选中 => 全选不选中
```js
ml_setCart() {

  let newAllChecked = true

  carts.forEach(v => {
    if(v.isChecked) { // true

    }else {
      newAllChecked = false
    }
  })

  // 单独处理 长度为0 的情况
  newAllChecked = carts.length > 0  ? newAllChecked : false

  this.setData({
    allChecked : newAllChecked
  })

}
```           

# 保存到本地
 - 每次操作都要保存到本地?
 ```js
 1. 在 ml_setCart(){} 里面 保存  
 2. wx.setStorageSync('cart', carts)
 3. 问题 : 需要每次操作都要保存吗?
 ```   

 - 一次性保存到本地??
 ```js
 - 在页面离开的时候, 一次性保存一次 
 - onHide() 
   // 隐藏
  onHide() {
    console.log('保存了')
    wx.setStorageSync('cart', this.data.carts)
  },
  onUnload() {
    console.log('保存了')
    wx.setStorageSync('cart', this.data.carts)
  },
 ```

# 点击结算 => 支付页面 
1. 注册点击事件 (不要使用 navigator 了)
2. 判断地址
3. 判断是否有选中商品
4. 跳转到 支付页面
```js
 // 跳转到支付页面
  async jump2pay() {
    //1. 解构
    let { addrObj, carts } = this.data

    //2. 判断 地址
    if (!addrObj.userName) {
      await ml_showToast('没有收货地址')
      return
    }

    //3.判断 过滤出来选中的商品 0
    carts = carts.filter(v => v.isChecked)
    if (carts.length == 0) {
      await ml_showToast('没有可支付的商品')
      return
    }

    //4. 跳转到支付页面
    // navigator => 声明式导航
    // js 跳转   => 编程式导航
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },
```


# 支付页面
- 1. 把 购物车页面(wxml 和 less ) 拷贝到 pay对应的文件里面 
- 2. 添加一个地址空对象 和 购物车空数组
```js
data: {
    addrObj: {},
    carts: []
  }
```
- 3. 从本地获取地址 和 购物车数据
```js
  onLoad() {
    //1. 获取地址
    let addr = wx.getStorageSync('address')

    //2. 获取购物车
    let carts = wx.getStorageSync('cart')
    carts = carts.filter(v => v.isChecked)

    //3. 保存
    this.setData({
      addrObj: addr,
      carts
    })
  }
```

- 4. 把 购物车列表不需要的清除一下
- 4.1 把 商品的多选框删除  => view.carts 移除
- 4.2 把 - 和 + 的组件 删除掉 , 在数量的前面 加 x 

- 5. 底部
- 5.1 全选移除
- 5.2 计算结算 + 合计




# --------3月1号 问题收集---------------------
<!-- 1. 演示 授权问题 -->
1. 打印  res.authSetting['scope.address'] 
2. 没有授权过 => undefined
   确定了     => true
   取消了     => false
3. 一开始打开的 时候     res => authSetting => 但是找不到 scope.address
  -   res => authSetting  所有的授权设置 
  - {
    // 地址 
    scope.address : true/false
    // 获取用户信息
    scope.userinfo : true/false
    // 获取地图权限
    scope.map : true/false
  }
4. 演示 - 前两行 和最后一行 切换着显示
```js
let res = await ml_getSetting()
consolg.log(res.authSetting['scope.address'])

this.ChooseAddress() // 获取收货地址
```  

5. 命令规范 
```js
let res = await cy_hqsz()  
consolg.log(res.authSetting['scope.address'])

this.ChooseAddress() // 获取收货地址
``` 

6. js基础的时候 => 命名规范  => 有意义 
-获取用户信息
 - aaaa()
 - getUserInfo()
 - loadAddressFromStorage()
 - 公司讲究的是团队协作 
 - ml_getSetting()
 - cy_getSetting()
 - cl_getSetting()

 <!-- 2. 重置 totalCount 和 totalPrice -->
 <!--  每次都要调 -->
 ml_setCart(carts){
   ......
 }

 <!-- 3.  取反 -->
 goods.isChecked = !goods.isChecked

 过滤
 carts.filter(v => v.goods.id !== id)


 <!-- 4. === 和  == -->
 - == 只判断数值是否相等   '1' == 1  true
 - === 判断数值 && 类型是否相等 '1' === 1  false 
                               '1' ==='1' true 
 - 后面 最好使用 === 严格判断    
 - 知道有个 standard 标准 => 
 - 1. 不用 ;    
 - 2. 使用 '' 单引号 
 - 3. 使用 ===
 .....      

 --------------- 0301  -----------------------
#  支付功能
- 登录 => token
- 支付功能需要token => 需要登录

# 官网给我们的演示图

# 支付逻辑 - 登录获取 token
1. 在点击支付按钮的时候 => 判断 
  - 判断是否有token
  - 如果有token 继续完成支付功能
  - 如果没有token => 跳转到 `授权登录`页面 => 登录 => token

2. 在`授权登录页面`里面`登录`获取`token`需要的五个参数
 - 参考 => 黑马优购接口 =>用户 => 获取用户 token
 - 分别获取五个参数
 - 2.1 获取用户信息(4个)
  ```js
  <button open-type='getUserInfo' bindgetuserinfo='getUserInfo' >获取授权</button>
  const { encryptedData, iv, rawData, signature  } = e.detail
  ```
  - 2.2 获取code(1个)
  ```js
    let { code } = await ml_wxlogin()
      console.log('获取code的', code)
  ```
3. 封装请求 - 登录 => 获取token
=> appid == `wx38d8faffac4d34d2`  => 微信号
=> 添加开发人员  
   ==> 我被加进去了
- 3.1 封装了fetch函数 => 基准地址改了 uninav
                     => POST
                     => resolve(res)
- 3.2 二次封装了获取token
```js
  export const ml_requestToken = (options) => {
    return fetch({
      url :'/user/wxlogin',
      data : options.data
    })
  }  
```                      
- 3.3 使用 
```js
// 1. 4个参数
// 2. 1个参数
let res  = await  ml_requestToken({
  data : { 1,2,3,4,5}
})
```
- 3.4 因为后台的appId 已经写死了, 我们目前不能使用我们自己的, 
 (不过这个没有关系, 大家以以后工作中 自己跟自己公司的后台交涉一下 把你的apppId 给他即可)
  - project.config.json => wx38d8faffac4d34d2 => 重启

- 3.5 拿到 token 保存到本地
```js
 //4. 判断
    if (res.data.meta.status === 200) {
      //4.1 保存token到本地
      wx.setStorageSync('token', res.data.message.token)

      await ml_showSuccessToast('授权成功')

      //4.2 返回到上一页
      wx.navigateBack({
        delta: 1
      })
    }
```

# 小问题
- 小问题1 : 大家看我演示 => 自习的时候, 他们一定要理思路
          - 伪代码
- 小问题2 : showToast 有个小bug , 和跳转在一起的时候 一闪而过
          - 解决办法 : 在跳转的地方添加一个延时器 2s / 3s         

# 创建订单
- 1. 准备 token  
- 2. 准备 oder_price 、consignee_addr 、goods
- 3. 封装 请求 创建订单
- 4. 发送请求
    token : 作为请求头
    其他三个参数 : 做个请求体
```js
  //3.2 创建订单发送请求
    let res1 = await ml_requestCreateOrder({
      data: {
        order_price,
        consignee_addr,
        goods
      },
      header: {
        Authorization: wx.getStorageSync('token')
      }
    })

    console.log('创建订单', res1)
```     
                    
# 预支付 
- 1. 看接口需要什么
   - token  => 本地存了
   - order_number => 创建订单有了
- 2. 封装请求
- 3. 使用 发送请求
```js
    // 4. 预支付
    let res2 = await ml_request_req_unifiedorder({
      data: {
        order_number
      },
      header: {
        Authorization: wx.getStorageSync('token')
      }
    })

    console.log('预支付', res2)
    const { pay } = res2.data.message
```

# 支付
- 参考官网 => api => 开放接口 =>支付 => wx.requestPayment()
- 需要的参数就是预支付返回的 pay 对象
- 封装 发起支付
```js
export const ml_requestPayMent = pay => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: resolve,
      fail: reject
    })
  })
}
```

```js
 // 5. 开始支付
    await ml_requestPayMent(pay)
```

# 查看订单是否支付成功
- 参考接口 : /my/orders/chkOrder
- 请求头参数 : token
- 请求体参数 : order_number 


# 支付逻辑总结------------------------------------
## 第一部分 : 登录 - 获取token  (面试 => 官网的图 )
- 用到的接口 : 接口 => 用户 => 获取用户 token
- 参数 : 五个参数
  - 前四个 => 获取用户信息 得到的
  - 最后一个code => wx.login => 获取到的
- 发送请求 => token   
- 在  auth.js 里面做的
 -====> 拿到 token 保存到本地

## 第二部分 : 支付 (面试)
#### 1. 创建订单
- 参考接口 : 订单 => 创建订单 
- 需要参数
 - 请求头 = :  token
 - 请求参数 : 总价格、收货地址、goods(goods_id goods_number goods_price)
- 返回的结果 => 订单号 order_number  


#### 2. 预支付
- 参考接口 : 支付 => 获取支付参数
- 需要参数 : 
  - 请求头 : token
  - 请求体 : order_number
- 返回的结果 => pay 对象  


#### 3. 开始支付
- 参考api : 微信小程序官网 => api => 开方接口 => 支付 
- wx.requestPayment(pay)
- 需要的参数 : pay对象 


#### 4. 查看支付状态
- 参考接口 : 订单 => 查看订单支付状态
- 需要参数
 - 请求头 : token
 - 请求体 : order_number
- 返回 => 200 => 提示 

----------------------------------------------

# 支付成功了 - 收尾
- 1. 支付成功了 把支付的商品从购物车里面移除去 
- 2. 支付成功跳转到订单页面 查看订单 
```js
 // 7.1 从购物车里面移除支付过的商品
  let carts = wx.getStorageSync('cart')
  carts = carts.filter(v => !v.isChecked)
  wx.setStorageSync('cart', carts)

  setTimeout(() => {
    // 7.2 跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/order'
    })
  }, 2000)
```

# 统计添加请求头 (token )
- 我们不想每次发送请求 手动添加 header(token)
- 我们就在等着的fetch里面统一添加header
```js
function fetch(options){

  if(options.url.startsWith('/my')){
    options.header = {
      Authorization: wx.getStorageSync('token')
    }
  }
}
```


# 面试简历
- 小程序项目
- 1. 获取收货地址授权处理
- 2. 购物车逻辑
- 3. 登录授权
- 4. 微信支付功能
- 5. 自定义封装组件 ( tab组件、goods-item组件、search-header组件 )
- 6. 对小程序的重构、封装、优化



---------------0302--------------------
# 订单页面
### tab 组件
- 1. 引入 + 使用 tab组件
- 2. 传递 tabs 数据
- 3. tabs :[  { id, title,isActive }]
- 4. 根据id 切换tabs 高亮
```js
 // 切换高亮状态
  toggleActiveById(id) {
    //1. 解构
    let { tabs } = this.data

    //2. 遍历tabs 设置高亮/排他
    tabs.forEach(v => {
      if (v.id === id) {
        v.isActive = true
      } else {
        v.isActive = false
      }
    })

    //3. 赋值
    this.setData({
      tabs
    })
  }
```

- 5. 根据id 发送请求获取数据
```js
// 获取对应的数据
  async getOrdersById(id) {
    let res = await ml_requestOrdersAll(id)
    console.log('订单数据', res)
  }
```

- 6. 页面一进来默认就要请求数据
### 列表

# 搜索页面
- 1. 创建 search 页面
- 2. 在 search-header 组件里面尝试跳转
     把 最外层的view =>  navigator+url='/pages/search/search'
- 3. 开始布局 搜索页面(搜索条 + 列表部分)
- 4. 参考接口 : 商品 => 商品搜索
   - 封装接口 + 测试接口 
   ```js
     onLoad() {
        this.loadListData(1)
      },

      // 请求查询的数据
      async loadListData(query) {
        let res = await ml_searchGoods(query)

        console.log('搜索的结果', res)
      }
   ```
- 5. 里面的逻辑
  - 5.1 在 data 里面定义1个初始值 searchText : ''
    data :{
      searchText :''
    }
  - 5.2 searchText 用在 input上面 
    `{{ searchText }}`

  - 5.3 监听 input 的内容变化, 赋值给 searchText 并且发送请求
  ```js
   handleInput(e){

     let val = e.detail.value

     this.setData({
       searchText : val  // 目前为值  searchText 一直没有用到 不着急
     })

     this.loadListData(val)
   }
  ``` 

- 6. 处理 取消按钮的显示和隐藏
  - 6.1 `isFocus : false`  => input内有没有输入内容
  - 6.2 使用
  ```js
    <view class="search-r" hidden="{{ !isFocus }}">
      <view class="cancel">取消</view>
    </view>
  ```
  - 6.3 当内容有值的时候
  ```js
   handleInput(e) {
     ....
    this.setData({
      isFocus: true
    })
    }

  ```

- 7. 点击取消按钮
```js
 // 点击取消
  clickCancel() {
    // 重置
    this.setData({
      searchText: '',
      isFocus: false,
      goods: []
    })
  }
```  

- 8. 点内容删除完毕, 判断内容是否为空
```js
 // 处理 input 数据
  handleInput(e) {
    //1. 收集值
    let val = e.detail.value

    // 内容为空的情况
    if (!val.trim()) {
      this.setData({
        isFocus: false,
        goods: []
      })
      return
    }
  }  
```

- 9. 防抖  _.debounce
- 需求 : 我想输入123, 123
- 防抖 => 不要重复搜索 => 一般使用在 `滚动 + 监听文本搜索`
- 节流 => `上拉刷新 hasMore return 节流`
```js
// 具体代码
//1. 把上面的那个延时器 清除掉
clearTimeout(this.timerId)
// 2. 新的延迟器记录下来
this.timerId = setTimeout(()=>{
  this.loadListData()
},500)
```

- 10. 有个小bug
- 输入123, 慢慢的删除123 ok的, `如果删除的比较快, 有bug了`
- 原因 : 发送请求获取数据 是异步的, 
-       如果很快的删除123, 同步的代码立马能执行 把 goods = []
        但是异步的数据慢慢的才回来, 有数据, 把 goods 再赋值一下 
- 解决办法 : 不然你异步的回来的有多晚, 我都在你请求回来回来之后,再判断文本是佛为空, 
- 代码
```js
async loadListData(val){

  let res = await ml_erquestSearch(val)

  this.setData({
    goods :res.data.message
  })

  // 在请求回来结果 重新赋值完毕后 再进行判断 
  if(!this.data.serachText.trim()) {
    this.setData({
      isFous : false,
      goods : []
    })
  }
}
```        

- 10. 想点击跳转
```js
// 把 view => navigator
    <view class="line1">{{ item.goods_name }}</view> 

// 改后的  
<navigator url="/pages/detail/detail?goods_id={{ item.goods_id }}" class="line1">
      {{ item.goods_name }}
    </navigator>

// 把 .less 文件的样式 view{} =>   navigator{} 
```