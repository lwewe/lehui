// ==================== 电影模块路由 ====================

// film/fim
// 电影首页
import FilmIndex from "@/views/film/FilmIndex.vue";
import FilmSeat from "@/views/film/fim/FilmSeat.vue";
import Multiplex from "@/views/film/fim/Multiplex.vue";
import MultiplexDetail from "@/views/film/fim/MultiplexDetail.vue";
import MultiplexNewDetail from "@/views/film/fim/MultiplexNewDetail.vue";
import FilmNewSeat from "@/views/film/fim/FilmNewSeat.vue";

// film/move
import FilmDetail from "@/views/film/move/FilmDetail.vue";
import HotList from "@/views/film/move/HotList.vue";

// film/list
import FilmCityList from "@/views/film/list/CityList.vue";

// film/order
import FilmOrderPage from "@/views/film/order/OrderPage.vue";
import FilmOrderInfo from "@/views/film/order/OrderInfo.vue";
import FilmPaymentPage from "@/views/film/order/PaymentPage.vue";
import FilmCardorderInfo from "@/views/film/order/CardorderInfo.vue";

// film/freeca
import FilmConsumptionRecords from "@/views/film/freeca/ConsumptionRecords.vue";
import FilmRechargeRecords from "@/views/film/freeca/RechargeRecords.vue";

const filmRoutes = [
     { path: '/filmindex', component: FilmIndex, meta: { title: '电影首页' } },
    { path: '/filmdetail', component: FilmDetail, meta: { title: '电影详情' } },
    { path: '/hotlist', component: HotList, meta: { title: '热映榜单', keepAlive: true, keep: true } },
    { path: '/multiplex', component: Multiplex, meta: { title: '影城' } },
    { path: '/multiplexDetail', component: MultiplexDetail, meta: { title: '影城详情' } },
    { path: '/multiplexNewDetail', component: MultiplexNewDetail, meta: { title: '影城详情' } },
    { path: '/filmSeat', component: FilmSeat, meta: { title: '电影选座' } },
    { path: '/filmNewSeat', component: FilmNewSeat, meta: { title: '电影选座' } },
    { path: '/filmCityList', component: FilmCityList, meta: { title: '城市列表' } },
    { path: '/filmOrderPage', component: FilmOrderPage, meta: { title: '订单详情' } },
    { path: '/filmOrderInfo', component: FilmOrderInfo, meta: { title: '订单' } },
    { path: '/filmPaymentPage', component: FilmPaymentPage, meta: { title: '支付' } },
    { path: '/filmCardorderInfo', component: FilmCardorderInfo, meta: { title: '福利卡订单详情' } },
    { path: '/filmConsumptionRecords', component: FilmConsumptionRecords, meta: { title: '消费记录' } },
    { path: '/filmRechargeRecords', component: FilmRechargeRecords, meta: { title: '充值记录' } },
];

export default filmRoutes;