// yanchu 首页
import YanchuView from '@/views/yanchu/YanchuView.vue'
import MoveList from '@/views/yanchu/MoveList.vue'

// yanchu/move （演出项目）
import PerformDetail from '@/views/yanchu/move/FilmDetail.vue'
// PerformList 文件还没建，先不引入

// yanchu/list
// import PerformCityList from '@/views/yanchu/list/CityList.vue'
import YanchuCityList from "@/views/city/CityListyanchu.vue";
// yanchu/order
import PerformOrderPage from '@/views/yanchu/order/OrderPage.vue'
import PerformOrderInfo from '@/views/yanchu/order/OrderInfo.vue'
import PerformPaymentPage from '@/views/yanchu/order/PaymentPage.vue'
import PerformCardorderInfo from '@/views/yanchu/order/CardorderInfo.vue'

// yanchu/performance （演出：榜单、分类、日历、门店）
import ChooseMoviegoers from '@/views/yanchu/performance/ChooseMoviegoers.vue'
import AddMoviegoers from '@/views/yanchu/performance/AddMoviegoers.vue'
import AllStore from '@/views/yanchu/performance/AllStore.vue'
import SortPage from '@/views/yanchu/performance/SortPage.vue'
import Leaderboard from '@/views/yanchu/performance/Leaderboard.vue'
import MustRobToday from '@/views/yanchu/performance/MustRobToday.vue'
import PerformanceCalendar from '@/views/yanchu/performance/PerformanceCalendar.vue'
import AddressList from '@/views/yanchu/performance/AddressList.vue'
import ExitAdress from "@/views/yanchu/performance/ExitAdress.vue";

const performRoutes = [
    // 首页
    { path: '/yanchuIndex', component: YanchuView, meta: { title: '演出首页', keepAlive: true } },
    { path: '/performDetail', component: PerformDetail, meta: { title: '演出详情' } },
    { path: '/performMoveList', component: MoveList, meta: { title: '充值商品' } },

    // 演出分类/榜单/日历
    { path: '/performSortPage', component: SortPage, meta: { title: '分类' } },
    { path: '/performLeaderboard', component: Leaderboard, meta: { title: '悦享演出榜', keepAlive: true } },
    { path: '/performMustRobToday', component: MustRobToday, meta: { title: '今日必抢', keepAlive: true } },
    { path: '/performCalendar', component: PerformanceCalendar, meta: { title: '演出日历', keepAlive: true } },
    { path: '/performAllStore', component: AllStore, meta: { title: '选择门店' } },

    // 观影人
    { path: '/chooseMoviegoers', component: ChooseMoviegoers, meta: { title: '选择观影人' } },
    { path: '/addMoviegoers', component: AddMoviegoers, meta: { title: '新增观影人' } },
    { path: '/peraddressList', component: AddressList, meta: { title: '选择地址' } },
    { path: '/exitAdress', component: ExitAdress, meta: { title: '添加地址' } },



    // 城市
    { path: '/yanchuCityList', component: YanchuCityList, meta: { title: '城市列表' } },

    // 订单
    { path: '/performOrderPage', component: PerformOrderPage, meta: { title: '订单详情' } },
    { path: '/performOrderInfo', component: PerformOrderInfo, meta: { title: '订单' } },
    { path: '/performPaymentPage', component: PerformPaymentPage, meta: { title: '支付' } },
    { path: '/performCardorderInfo', component: PerformCardorderInfo, meta: { title: '福利卡订单详情' } },
]

export default performRoutes