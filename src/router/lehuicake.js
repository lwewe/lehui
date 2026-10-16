// yanchu 首页
import CakeView from '@/views/cake/CakeView.vue'

// cake 相关页面
import CakeShopCart from '@/views/cake/cart/ShopCart.vue'
import CakeProductDetail from '@/views/cake/product/ProductDetail.vue'
import CakeConfirmOrder from '@/views/cake/order/ConfirmOrder.vue'
import CakeOrderFood from '@/views/cake/store/OrderFood.vue'
import CakeBirthdayCake from '@/views/cake/birthday/BirthdayCake.vue'
import CakeBrandDetail from '@/views/cake/brand/BrandDetail.vue'
import CakeBrandCouPon from '@/views/cake/brand/BrandCouPon.vue'
import CakeCouPonDetail from '@/views/cake/brand/CouPonDetail.vue'
import CakeCouPonConfirmOrder from '@/views/cake/order/CouPonConfirmOrder.vue'

const performRoutes = [
    // 首页
    { path: '/CakeView', component: CakeView, meta: { title: '蛋糕首页', keepAlive: true } },

    // cake 相关（加 /cake 前缀，防止和其他路由冲突）
    { path: '/CakeshopCart', component: CakeShopCart, meta: { title: '购物车' } },
    { path: '/CakeproductDetail', component: CakeProductDetail, meta: { title: '商品详情' } },
    { path: '/CakeconfirmOrder', component: CakeConfirmOrder, meta: { title: '确认订单' } },
    { path: '/Cakeorderfood', component: CakeOrderFood, meta: { title: '到店消费', keepAlive: true, keep: true } },
    { path: '/CakebirthdayCake', component: CakeBirthdayCake, meta: { title: '生日蛋糕', keepAlive: true, keep: true } },
    { path: '/CakebrandDetail', component: CakeBrandDetail, meta: { title: '品牌详情' } },
    { path: '/CakebrandCouPon', component: CakeBrandCouPon, meta: { title: '品牌详情' } },
    { path: '/CakecouPonDetail', component: CakeCouPonDetail, meta: { title: '卡券详情' } },
    { path: '/CakecouPonConfirmOrder', component: CakeCouPonConfirmOrder, meta: { title: '确认订单' } },
]

export default performRoutes