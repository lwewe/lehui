import setaxios from '@/utils/setaxios'

// ==================== 通用入口 ====================
 export function filmApi(method, data = {}) {
    return setaxios.post('/film/getList', {
        method: method,
        data: JSON.stringify(data)
    })
}

// 影片详情
export function getMovieDetail(data) {
    return filmApi('xuankua.movie.detail', data)
}
// 影片近期有排片的影院id
export function getMovieCinemaList(data) {
    return filmApi('xuankua.movie.play.cinema.list', data)
}
// 影院详情
export function getCinemaDetail(data) {
    return filmApi('xuankua.cinema.detail', data)
}
// 影院排期列表
export function getOpiList(data) {
    return filmApi('xuankua.opi.list.v2', data)
}
// 影院排期详情
export function getOpiDetail(data) {
    return filmApi('xuankua.opi.detail.v2', data)
}
// 排片座位图
export function getOpiSeat(data) {
    return filmApi('xuankua.opi.seat', data)
}

// ==================== 独立接口 ====================

// 城市列表
export function getCityList(data = {}) {
    const formData = new FormData()
    formData.append('keyword', data.keyword || '')
    return setaxios.post('/film/citylist', formData)
}

// 热门城市查询
export function getHotCity() {
    return setaxios.post('/film/hotcity')
}

// 首页轮播图
export function getIndexBannerList() {
    return setaxios.post('/film/sylbt')
}

// 影城-轮播图
export function getCinemaBannerList() {
    return setaxios.post('/film/yclbt')
}

// 购票/观影须知
export function getTicketNotice() {
    return setaxios.post('/film/guide')
}

// 影院列表
export function getCinemaList(data) {
    return setaxios.post('/film/cinema', {
        cityid: data.cityid,
        lng: data.lng,
        lat: data.lat,
        quid: data.quid || '',
        keyword: data.keyword || '',
        movieId: data.movieId || ''
    })
}
// 热映/待映
// 热映电影列表
export function getHitFilmList(data = {}) {
    return setaxios.post('/film/getList', {
        method: 'xuankua.movie.hot.list',
        data: JSON.stringify(data)
    })
}

// 即将上映电影列表
export function getComingMoviesList(data = {}) {
    return setaxios.post('/film/getList', {
        method: 'xuankua.movie.future.list',
        data: JSON.stringify(data)
    })
}

// ==================== 订单 ====================
export function getUnpaidOrder() {
    return setaxios.post('/film/unpayorder')
}
export function lockSeatOrder(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/lockseat', formData)
}
export function cancelLockOrder(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/unlockseat', formData)
}
export function getSettleOrderDetail(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/jsordershow', formData)
}
export function getOrderDetail(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/orderdetail', formData)
}

// ==================== 福利卡 / 支付 ====================
export function getWelfareCardList() {
    return setaxios.post('/film/card')
}
export function checkCardBalance(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/pay_date', formData)
}
export function payByWelfareCard(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/pay_date', formData)
}
export function wxPay(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/wxpay', formData)
}
export function paySuccess(data) {
    const formData = new FormData()
    Object.keys(data).forEach(k => formData.append(k, data[k]))
    return setaxios.post('/film/pay_success', formData)
}
export function wxPayNotify(data) {
    return setaxios.post('/film/dy_notify', data)
}
export function filmPushOrder(data) {
    return setaxios.post('/film/pushorder', data)
}