// yanchu 首页
import CakeView from '@/views/cake/CakeView.vue'

// cake 相关页面
import CakeShopCart from '@/views/cake/cart/ShopCart.vue'
import CakeProductDetail from '@/views/cake/cake/ProductDetail.vue'
// cakeCityList
import cakeCityList from '@/views/cake/city/CakeCityList.vue'
import AllStore from '@/views/cake/city/AllStore.vue'



import CakeConfirmOrder from '@/views/cake/order/ConfirmOrder.vue'
import BirthdayCake from '@/views/cake/cake/BirthdayCake.vue'

import CakeAddressList from '@/views/cake/mine/CakeAddressList.vue'
import MapPickercake from '@/views/cake/mine/MapPicker.vue'
import cakeExitAdress from '@/views/cake/mine/CakeExitAdress.vue'
import OrderFood from '@/views/cake/store/OrderFood.vue'

// import CakeOrderFood from '@/views/cake/store/OrderFood.vue'
// import CakeBirthdayCake from '@/views/cake/birthday/BirthdayCake.vue'
// import CakeBrandDetail from '@/views/cake/brand/BrandDetail.vue'
  import BrandCouPon from '@/views/cake/brand/BrandCouPon.vue'
  import CouPonDetail from '@/views/cake/brand/CouPonDetail.vue'
 import CakeCouPonConfirmOrder from '@/views/cake/order/CouPonConfirmOrder.vue'



const performRoutes = [
  // 首页
  { path: '/CakeView', component: CakeView, meta: { title: '蛋糕首页', keepAlive: true } },

  // cake 相关（加 /cake 前缀，防止和其他路由冲突）
  { path: '/CakeshopCart', component: CakeShopCart, meta: { title: '购物车' } },
  { path: '/cakeCityList', component: cakeCityList, meta: { title: '城市' } },
{ path: '/orderfood', component: OrderFood, meta: { title: '电子券' } },
{ path: '/birthdayCake', component: BirthdayCake, meta: { title: '蛋糕' } },
  { path: '/AllStore', component: AllStore, meta: { title: '门店' } },
  { path: '/MapPickercake', component: MapPickercake, meta: { title: '地址' } },
  { path: '/cakeExitAdress', component: cakeExitAdress, meta: { title: '地址' } },
  { path: '/CakeAddressList', component: CakeAddressList, meta: { title: '地址' } },
  { path: '/CakeproductDetail', component: CakeProductDetail, meta: { title: '商品详情' } },
  { path: '/CakeconfirmOrder', component: CakeConfirmOrder, meta: { title: '确认订单' } },
  // { path: '/Cakeorderfood', component: CakeOrderFood, meta: { title: '到店消费', keepAlive: true, keep: true } },
  // { path: '/CakebirthdayCake', component: CakeBirthdayCake, meta: { title: '生日蛋糕', keepAlive: true, keep: true } },
  // { path: '/CakebrandDetail', component: CakeBrandDetail, meta: { title: '品牌详情' } },

   { path: '/BrandCouPon', component: BrandCouPon, meta: { title: '品牌详情' } },

 { path: '/CouPonDetail', component: CouPonDetail, meta: { title: '卡券详情' } },


  { path: '/CakeCouPonConfirmOrder', component: CakeCouPonConfirmOrder, meta: { title: '确认订单' } },
]

export default performRoutes