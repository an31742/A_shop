import fetch from './fetch'

/**
 * 请求轮播图数据
 */
export const ml_requestSwipersData = () => {
  return fetch({
    url: '/home/swiperdata'
  })
}

/**
 * 请请求导航菜单数据
 */
export const ml_requestMenusData = () => {
  return fetch({
    url: '/home/catitems'
  })
}

/**
 * 请求楼层数据
 */
export const ml_requestFloorsData = () => {
  return fetch({
    url: '/home/floordata'
  })
}

/**
 * 请求分类数据
 */
export const ml_requestCatesData = () => {
  return fetch({
    url: '/categories'
  })
}

/**
 * 请求列表数据
 */
export const ml_requestListData = (cid, pagenum) => {
  return fetch({
    url: '/goods/search',
    data: {
      cid,
      pagenum, // 页码
      pagesize: 10 // 每页的数量
    }
  })
}

/**
 * 请求详情页数据
 */
export const ml_requestDetailData = goods_id => {
  return fetch({
    url: '/goods/detail',
    data: {
      goods_id
    }
  })
}
