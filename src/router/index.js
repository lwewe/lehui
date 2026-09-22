import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "@/HelloWorld.vue";
import VueRouter from "vue-router";
import IndexView from "@/views/IndexView.vue";
import ShopCart from "@/views/cart/ShopCart.vue";
import Freeca from "@/views/freeca/Freeca.vue";
import PersonCenter from "@/views/mine/PersonCenter.vue";
import OrderInfo from "@/views/order/OrderInfo.vue";
import OrderDetail from "@/views/order/OrderDetail.vue";


import Classification from "@/views/classification/Classification.vue";
import ProductList from "@/views/product/ProductList.vue";
import ProductDetail from "@/views/product/ProductDetail.vue";
import ConfirmOrder from "@/views/order/ConfirmOrder.vue";
import AddressManagement from "@/views/mine/AddressManagement.vue";
import AddAdress from "@/views/mine/AddAdress.vue";

// ff
import MapPicker from "@/views/shopcate/MapPicker.vue";

import FlowerDetail from "@/views/product/FlowerDetail.vue";
import HemaDetail from "@/views/product/HemaDetail.vue";
import FlowerConfirmOrder from "@/views/order/FlowerConfirmOrder.vue";
import ConfirmOrderHema from "@/views/order/ConfirmOrderHema.vue";

import TuHuConfirmOrder from "@/views/order/TuHuConfirmOrder.vue";

 
import TuhuZone from "@/views/shopcate/TuhuZone.vue";
import FlowerZone from "@/views/shopcate/FlowerZone.vue";
import HomeDap from "@/views/shoplh/HomeDap.vue";
import HomeXianh from "@/views/shoplh/HomeXianh.vue";
import HomeQingl from "@/views/shoplh/HomeQingl.vue";
import HomeQinglyx from "@/views/shoplh/HomeQinglyx.vue";
import HomeHot from "@/views/shoplh/HomeHot.vue";
import shipInfo from "@/views/shoplh/shipInfo.vue";
import payPassword from "@/views/shoplh/payPassword.vue";
import FeedBackdetails from "@/views/shoplh/FeedBackdetails.vue";
import FeedBack from "@/views/shoplh/FeedBack.vue";
import payOrder from "@/views/lhpay/payOrder.vue";
import payOrderZhf from "@/views/lhpay/payOrderZhf.vue";
import UseExplain from "@/views/agreement/UseExplain.vue";
import YinsiZhengce from "@/views/agreement/YinsiZhengce.vue";
import NearbyShop from "@/views/shoplh/NearbyShop.vue";
import Package from "@/views/freeca/Package.vue";
import CouponCode from "@/views/mine/CouponCode.vue";
import BindingCard from "@/views/mine/BindingCard.vue";
import AddCard from "@/views/mine/AddCard.vue";
import RightsRecord from "@/views/mine/RightsRecord.vue";
import RightsRecorddetails from "@/views/mine/RightsRecorddetails.vue";
import FoodDelivery from "@/views/shoplh/FoodDelivery.vue";
import JingzaoHome from "@/views/shoplh/JingzaoHome.vue";
import JingzaoCategory from "@/views/shoplh/JingzaoCategory.vue";
import JingzaoSuperValue from "@/views/shoplh/JingzaoSuperValue.vue";
import JingdongChannel from "@/views/shoplh/JingdongChannel.vue";
import JingdongCategory from "@/views/shoplh/JingdongCategory.vue";
import JingdongSuperValueList from "@/views/shoplh/JingdongSuperValueList.vue";
import TmallSupermarket from "@/views/shoplh/TmallSupermarket.vue";
import TmallCategory from "@/views/shoplh/TmallCategory.vue";
import TmallTodaySuperLow from "@/views/shoplh/TmallTodaySuperLow.vue";
import TmallExclusiveNew from "@/views/shoplh/TmallExclusiveNew.vue";
import HemaFresh from "@/views/shoplh/HemaFresh.vue";
import HemaFreshnew from "@/views/shoplh/HemaFreshnew.vue";
import ApplianceChannel from "@/views/shopcate/ApplianceChannel.vue";
import AppBrandRecommend from "@/views/shopcate/AppBrandRecommend.vue";
import ApplianceRecommend from "@/views/shopcate/ApplianceRecommend.vue";
import DrinkZone from "@/views/shopcate/DrinkZone.vue";
import DrinkFreshMilkPage from "@/views/shopcate/DrinkFreshMilkPage.vue";
import DrinkHotRankList from "@/views/shopcate/DrinkHotRankList.vue";
import DrinkTabZone from "@/views/shopcate/DrinkTabZone.vue";
import SnackZone from "@/views/shopcate/SnackZone.vue";
import SnackHotProductPage from "@/views/shopcate/SnackHotProductPage.vue";
import SnackFoodRankList from "@/views/shopcate/SnackFoodRankList.vue";
import SnackLightFoodZone from "@/views/shopcate/SnackLightFoodZone.vue";
import BrandSeasonPage from "@/views/shoplh/BrandSeasonPage.vue";
import BeautyZone from "@/views/shopcate/BeautyZone.vue";
import TissueZone from "@/views/shopcate/TissueZone.vue";
import TissueSuperHotRankList from "@/views/shopcate/TissueSuperHotRankList.vue";
import TissueCleanGoodsList from "@/views/shopcate/TissueCleanGoodsList.vue";
import HomeFlashSalePage from "@/views/shoplh/HomeFlashSalePage.vue";
import BeautyZoneNewList from "@/views/shopcate/BeautyZoneNewList.vue";




//ff


import Setting from "@/views/mine/Setting.vue";
import CityList from "@/views/city/CityList.vue";
import FlashSale from "@/views/product/FlashSale.vue";
import HotProduct from "@/views/product/HotProduct.vue";
import QuickLogin from "@/views/login/QuickLogin.vue";
import Login from "@/views/login/Login.vue";
import DirectCharge from "@/views/service/DirectCharge.vue";
import NewProduct from "@/views/product/NewProduct.vue";
import SelectBrand from "@/views/product/SelectBrand.vue";
import HelpFamer from "@/views/product/HelpFamer.vue";
import UserGuide from "@/views/mine/UserGuide.vue";
import ActivityZone from "@/views/product/ActivityZone.vue";
import orderOrderDetail from "@/views/order/orderOrderDetail.vue";
import ProductDescription from "@/views/mine/ProductDescription.vue";
import Notification from "@/views/service/Notification.vue";

Vue.use(Router)


const routes = [
    {
        path: '',
        redirect: "/index"
    },
    {
        path: '/helloWord',
        component: HelloWorld,
        meta: {
            title: 'helloWord'
        }
    }, {
        path: '/index',
        component: IndexView,
        meta: {
            title: '首页',
            keepAlive: true,
            keep: true,
            active: 0
        }
    }, {
        path: '/classification',
        component: Classification,
        meta: {
            title: '分类',
            keepAlive: true,
            keep: true,
            active: 1
        }
    }, {
        path: '/shopCart',
        component: ShopCart,
        meta: {
            title: '购物车'
        }
    }, {
        path: '/freeca',
        component: Freeca,
        meta: {
            title: '福利卡'
        }
    }, {
        path: '/mine',
        component: PersonCenter,
        meta: {
            title: '我的',
            keepAlive: true,
            keep: true,
            active: 4
        }
    }, {
        path: '/orderDetail',
        component: OrderDetail,
        meta: {
            title: '订单详情'
        }
    },
    {
        path: '/FlowerDetail',
        component: FlowerDetail,
        meta: {
            title: '详情',
            keepAlive: true,     // ✅ 加这个
            keep: true
        }
    },

    {
        path: '/MapPicker',
        component: MapPicker,
        meta: {
            title: '地图选点',

        }
    },


    {
        path: '/FlowerConfirmOrder',
        component: FlowerConfirmOrder,
        meta: {
            title: '提交订单'
        }
    },

    {
        path: '/TuHuConfirmOrder',
        component: TuHuConfirmOrder,
        meta: {
            title: '提交途虎'
        }
    },
    {
        path: '/TuhuZone',
        component: TuhuZone,
        meta: {
            title: '提交订单',
             keepAlive: true
        }
    },



    {
        path: '/productList',
        component: ProductList,
        meta: {
            title: '商品',
            keepAlive: true

        }
    }, {
        path: '/productDetail',
        component: ProductDetail,
        meta: {
            title: '商品详情'
        }
    }, {
        path: '/confirmOrder',
        component: ConfirmOrder,
        meta: {
            title: '确认订单'
        }
    }, {
        path: '/orderInfo',
        component: OrderInfo,
        meta: {
            title: '订单',
            // keepAlive:true
        }
    }, {
        path: '/address',
        component: AddressManagement,
        meta: {
            title: '地址管理'
        }
    }, {
        path: '/addAddress',
        component: AddAdress,
        meta: {
            title: '新建地址'
        }
    },
    {
        path: '/AddCard',
        component: AddCard,
        meta: {
            title: '添加福利卡'
        }
    }, {
        path: '/RightsRecord',
        component: RightsRecord,
        meta: {
            title: '福利卡权益'
        }
    },
    {
        path: '/RightsRecorddetails',
        component: RightsRecorddetails,
        meta: {
            title: '福利卡权益详情'
        }
    },
    {
        path: '/payOrder',
        component: payOrder,
        meta: {
            title: '收银台'
        }
    },
    {
        path: '/payOrderZhf',
        component: payOrderZhf,
        meta: {
            title: '收银台'
        }
    },

    {
        path: '/FeedBack',
        component: FeedBack,
        meta: {
            title: '意见反馈'
        }
    },
    {
        path: '/FeedBackdetails',
        component: FeedBackdetails,
        meta: {
            title: '反馈提交'
        }
    },

    {
        path: '/payPassword',
        component: payPassword,
        meta: {
            title: '密码设置'
        }
    },
    {
        path: '/shipInfo',
        component: shipInfo,
        meta: {
            title: '物流查询'
        }
    }, {
        path: '/HomeHot',
        component: HomeHot,
        meta: {
            title: '好物推荐'
        }
    },
    {
        path: '/HomeQinglyx',
        component: HomeQinglyx,
        meta: {
            title: '清凉一夏',
            keepAlive: true
        }
    },

    {
        path: '/HomeDap',
        component: HomeDap,
        meta: {
            title: '大牌',
            keepAlive: true
        }
    },
    {
        path: '/HomeXianh',
        component: HomeXianh,
        meta: {
            title: '鲜活'
        }
    },
    {
        path: '/HomeQingl',
        component: HomeQingl,
        meta: {
            title: '清凉',
            keepAlive: true
        }
    },




    {
        path: '/FlowerZone',
        component: FlowerZone,
        meta: {
            title: '鲜花', keepAlive: true
        }
    },
 {
        path: '/HemaDetail',
        component: HemaDetail,
        meta: {
            title: '盒马', keepAlive: true
        }
    },

{
        path: '/ConfirmOrderHema',
        component: ConfirmOrderHema,
        meta: {
            title: '盒马支付'
        }
    },
    
    {
        path: '/FoodDelivery',
        component: FoodDelivery,
        meta: {
            title: '美食',
            keepAlive: true
        }
    },
    {
        path: '/JingzaoHome',
        component: JingzaoHome,
        meta: {
            title: '京东京造',
             keepAlive: true
        }
    },
    {
        path: '/JingzaoCategory',
        component: JingzaoCategory,
        meta: {
            title: '京造分类',
             keepAlive: true
        }
    },
    {
        path: '/JingzaoSuperValue',
        component: JingzaoSuperValue,
        meta: {
            title: '超值推荐',
             keepAlive: true
        }
    },
    {
        path: '/JingdongChannel',
        component: JingdongChannel,
        meta: {
            title: '京东频道',
             keepAlive: true
        }
    },
    {
        path: '/JingdongCategory',
        component: JingdongCategory,
        meta: {
            title: '京东分类',
             keepAlive: true
        }
    },
    {
        path: '/JingdongSuperValueList',
        component: JingdongSuperValueList,
        meta: {
            title: '超值购',
             keepAlive: true
        }
    },
    {
        path: '/TmallSupermarket',
        component: TmallSupermarket,
        meta: {
            title: '天猫超市',
             keepAlive: true
        }
    },
    {
        path: '/TmallCategory',
        component: TmallCategory,
        meta: {
            title: '天猫分类',
             keepAlive: true
        }
    },

    {
        path: '/TmallExclusiveNew',
        component: TmallExclusiveNew,
        meta: {
            title: '天猫上新',
             keepAlive: true
        }
    }, {
        path: '/TmallTodaySuperLow',
        component: TmallTodaySuperLow,
        meta: {
            title: '天猫补贴',
            keepAlive: true
        }
    },
    {
        path: '/HemaFresh',
        component: HemaFresh,
        meta: {
            title: '盒马生鲜',
            keepAlive: true
        }
    },
    {
        path: '/HemaFreshnew',
        component: HemaFreshnew,
        meta: {
            title: '盒马生鲜',keepAlive: true
        }
    },
    {
        path: '/ApplianceChannel',
        component: ApplianceChannel,
        meta: {
            title: '家电',
            keepAlive: true
        }
    },
    {
        path: '/AppBrandRecommend',
        component: AppBrandRecommend,
        meta: {
            title: '家电推荐',
            keepAlive: true
        }
    },
    {
        path: '/ApplianceRecommend',
        component: ApplianceRecommend,
        meta: {
            title: '推荐',
            keepAlive: true
        }
    },
    {
        path: '/DrinkZone',
        component: DrinkZone,
        meta: {
            title: '饮品专区',
            keepAlive: true
        }
    },

    {
        path: '/DrinkFreshMilkPage',
        component: DrinkFreshMilkPage,
        meta: {
            title: '饮品专区',
            keepAlive: true
        }
    }, {
        path: '/DrinkHotRankList',
        component: DrinkHotRankList,
        meta: {
            title: '爆款',
            keepAlive: true
        }
    }, {
        path: '/DrinkTabZone',
        component: DrinkTabZone,
        meta: {
            title: '饮品专区',
            keepAlive: true
        }
    },
    {
        path: '/SnackZone',
        component: SnackZone,
        meta: {
            title: '零食区',
            keepAlive: true
        }
    },
    {
        path: '/SnackFoodRankList',
        component: SnackFoodRankList,
        meta: {
            title: '零食区',
            keepAlive: true
        }
    }, {
        path: '/SnackHotProductPage',
        component: SnackHotProductPage,
        meta: {
            title: '零食区',
            keepAlive: true
        }
    }, {
        path: '/SnackLightFoodZone',
        component: SnackLightFoodZone,
        meta: {
            title: '零食区',
            keepAlive: true
        }
    },
    {
        path: '/BrandSeasonPage',
        component: BrandSeasonPage,
        meta: {
            title: '品牌',
            keepAlive: true
        }
    },
    {
        path: '/BeautyZone',
        component: BeautyZone,
        meta: {
            title: '美妆区',
            keepAlive: true
        }
    },
    {
        path: '/TissueZone',
        component: TissueZone,
        meta: {
            title: '纸巾区',
            keepAlive: true
        }
    },

    {
        path: '/TissueCleanGoodsList',
        component: TissueCleanGoodsList,
        meta: {
            title: '纸巾区',
            keepAlive: true
        }
    },
    {
        path: '/HomeFlashSalePage',
        component: HomeFlashSalePage,
        meta: {
            title: '首页特价',
            keepAlive: true
        }
    },

    {
        path: '/BeautyZoneNewList',
        component: BeautyZoneNewList,
        meta: {
            title: '美妆上新',
            keepAlive: true
        }
    },

    {
        path: '/TissueSuperHotRankList',
        component: TissueSuperHotRankList,
        meta: {
            title: '纸巾区',
            keepAlive: true
        }
    },
    {
        path: '/BindingCard',
        component: BindingCard,
        meta: {
            title: '绑卡'
        }
    },
    {
        path: '/CouponCode',
        component: CouponCode,
        meta: {
            title: '绑卡'
        }
    }, {
        path: '/Package',
        component: Package,
        meta: {
            title: '充值'
        }
    },
    {
        path: '/NearbyShop',
        component: NearbyShop,
        meta: {
            title: '充值'
        }
    },
    {
        path: '/YinsiZhengce',
        component: YinsiZhengce,
        meta: {
            title: '隐私协议'
        }
    },
    {
        path: '/UseExplain',
        component: UseExplain,
        meta: {
            title: '说明规则'
        }
    },


    {
        path: '/setting',
        component: Setting,
        meta: {
            title: '设置'
        }
    }, {
        path: '/cityList',
        component: CityList,
        meta: {
            title: '城市'
        }
    }, {
        path: '/flashSale',
        component: FlashSale,
        meta: {
            title: '特卖专区',
            keepAlive: true,
            keep: true,
        }
    }, {
        path: '/hotProduct',
        component: HotProduct,
        meta: {
            title: '热门商品',
            keepAlive: true,
            keep: true,
        }
    }, {
        path: '/quickLogin',
        component: QuickLogin,
        meta: {
            title: '快捷登录'
        }
    }, {
        path: '/login',
        component: Login,
        meta: {
            title: '登录'
        }
    }, {
        path: '/directCharge',
        component: DirectCharge,
        meta: {
            title: '卡券详情'
        }
    }, {
        path: '/newProduct',
        component: NewProduct,
        meta: {
            title: '新品专区',
            keepAlive: true,
            keep: true,
        }
    }, {
        path: '/selectBrand',
        component: SelectBrand,
        meta: {
            title: '甄选品牌',
            keepAlive: true,
            keep: true,
        }
    },
    {
        path: '/helpfamer',
        component: HelpFamer,
        meta: {
            title: '爱心助农',
            keepAlive: true,
            keep: true,
        }
    },
    {
        path: '/userGuide',
        component: UserGuide,
        meta: {
            title: '使用指南',
            keepAlive: true,
            keep: true,
        }
    }, {
        path: '/activityZone',
        component: ActivityZone,
        meta: {
            title: '活动专区',
            keepAlive: true,
            keep: true,
        }
    }, {
        path: '/orderOrderDetail',
        component: orderOrderDetail,
        meta: {
            title: '订单详情'
        }
    }, {
        path: '/productDescription',
        component: ProductDescription,
        meta: {
            title: '产品介绍'
        }
    }, {
        path: '/notification',
        component: Notification,
        meta: {
            title: '春节发货通知'
        }
    },
]

const router = new Router({
    routes,
    // mode: 'history'
})
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location, onResolve, onReject) {

    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)

    return originalPush.call(this, location).catch(err => err)

}
// ==========================================
// 新增：全局路由权限拦截 (解决直输URL不跳登录的问题)
// ==========================================
router.beforeEach((to, from, next) => {
    // 1. 设置页面标题
    document.title = to.meta.title || '悦享聚汇';

    // 2. 获取当前 Token
    const token = localStorage.getItem("token");

    // 3. 定义不需要验证登录即可访问的白名单页面
    const whiteList = [
        '/login', '/quickLogin',
        '/yinsizhengce', '/useexplain',
        '/classification', '/shopCart', '/freeca'
    ];

    // 4. 路由拦截逻辑
    if (token) {
        // 情况 A：有 Token
        // 如果用户有 Token 但意图去登录页，直接踢回首页（防止重复登录）
        if (to.path === '/login' || to.path === '/quickLogin') {
            next('/index');
        } else {
            // 其他页面直接放行
            next();
        }
    } else {
        // 情况 B：没有 Token
        if (whiteList.includes(to.path)) {
            // 如果去的是白名单内的页面（无需登录），直接放行
            next();
        } else {
            // 如果去的是需要登录的页面（如 /mine, /AddCard, /BindingCard 等），强制拦截并跳去登录页
            // 微信环境走微信快捷登录，普通浏览器走普通登录
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                next('/quickLogin');
            } else {
                next('/login');
            }
        }
    }
});

export default router