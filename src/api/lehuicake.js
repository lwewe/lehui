import setaxios from '@/utils/setaxios'

/* ==================== 城市 ==================== */

// 城市列表（A-Z 分组）
export function getCityList() {
    return setaxios.post('/cake/city', {})
}

// 城市关键词搜索
export function searchCity(keyword) {
    return setaxios.post('/cake/searchcity', { keyword })
}

// 搜索城市（选城市，传城市名，如 "北京市"）
export function selectCity(city) {
    return setaxios.post('/cake/sscity', { city })
}
/* ==================== 首页 / 商品 ==================== */

// 蛋糕首页（banner、品牌等）
export function getCakeIndex(cid) {
    return setaxios.post('/cake/index', { cid })
}

// 首页产品分页
export function getCakeSyProduct({ cid, page = 1, limit = 20 }) {
    return setaxios.post('/cake/syproduct', { cid, page, limit })
}

// 品牌列表
// flag: 1-全部品牌 2-品牌精选 3-生日蛋糕
export function getCakeBrand({ cid, flag = 1, page = 1, limit = 20, keyword = '' }) {
    return setaxios.post('/cake/brand', { cid, flag, page, limit, keyword })
}

// 品牌详情
export function getCakeBrandShow({ cid, id }) {
    return setaxios.post('/cake/ppShow', { cid, id })
}

// 产品列表（生日蛋糕）
// type: 1-综合推荐 2-销量高→低 3-新品优先 4-价格低→高 5-价格高→低
export function getCakeBirthday({ cid, type = 1, brand_id, minprice, maxprice, keyword, page = 1, limit = 20 }) {
    // 动态组装参数，剔除 undefined / null / 空字符串
    const params = {
        cid,
        type,
        page,
        limit
    };

    if (brand_id) params.brand_id = brand_id;
    if (minprice) params.minprice = minprice;
    if (maxprice) params.maxprice = maxprice;
    if (keyword) params.keyword = keyword;

    return setaxios.post('/cake/birthday', params);
}

// 产品详情（gueige[].ggid 即规格 spec_id）
export function getCakeShow({ cid, id }) {
    return setaxios.post('/cake/show', { cid, id })
}

/* ==================== 购物车 ==================== */

// 添加购物车
// product_id 产品ID, spec_id 规格id(来自 gueige[].ggid), quantity 数量,
// cpbs 2-蛋糕, gid 供应商ID(没有传0), flag 0-接口/1-上传
export function addCart(data) {
    return setaxios.post('/cake/addcart', {
        product_id: data.product_id,
        spec_id: data.spec_id,
        quantity: data.quantity,
        taste_name: data.taste_name || '',
        cpbs: data.cpbs || 2,
        gid: data.gid || 0,
        flag: data.flag !== undefined ? data.flag : 1
    })
}

// 购物车列表
export function getCart(cid) {
    return setaxios.post('/cake/cart', { cid })
}

// 修改购物车数量（num=0 表示删除该条）
export function editCart(id, num) {
    return setaxios.post('/cake/editcart', { id, num })
}

// 删除购物车（单个传ID，多个逗号拼接，如 "2705,10676"）
export function delCart(cartIds) {
    return setaxios.post('/cake/delcart', { cartIds })
}

/* ==================== 结算 ==================== */

// 结算 - 购物车（act=1）
// cartIds 购物车ID，多个逗号拼接
export function checkoutByCart({ cid, cartIds, address_id }) {
    return setaxios.post('/cake/checkout', { cid, act: 1, cartIds,address_id})
}

// 结算 - 立即购买（act=2）
export function checkoutBuyNow(data) {
    return setaxios.post('/cake/checkout', {
        cid: data.cid,
        act: 2,
        product_id: data.product_id,
        quantity: data.quantity,
        spec_id: data.spec_id,
        taste_name: data.taste_name || '',
        cpbs: data.cpbs || 2,
        gid: data.gid || 0,
        flag: data.flag !== undefined ? data.flag : 0,
        address_id: data.address_id
    })
}

// 选地址-检测配送
// brand_id 传 pinpai.brand_id（品牌ID），不是 pinpai.id
// 返回 address_list，is_distribution=1 才可配送
export function checkDelivery({ cid, spec_id, quantitys = 1, flag = 0, brand_id }) {
    return setaxios.post('/cake/dgseladdress', { cid, spec_id, quantitys, flag, brand_id })
}

/* ==================== 支付 ==================== */

// 立即支付-计算卡是否够支付
// act 1-购物车/2-立即购买；fulika 福利卡号多个逗号；data 配送信息JSON
// act=1 传 cartIds；act=2 传 product_id/spec_id/quantity/cpbs/flag/gid
export function payDate(data) {
    return setaxios.post('/cake/pay_date', data)
}

// 福利卡支付
// 必传：cid, ka_ids(福利卡ID数组字符串), dkprice, pass, code, total, act, address_id, phone, data
// act=1 传 cartIds；act=2 传 product_id/spec_id/taste_name/quantity/cpbs/flag/gid
// code 和 total 必须来自 checkout 返回
export function payByCard(data) {
    return setaxios.post('/cake/flkpay', data)
}

// 微信支付
// 必传：total, act, address_id, phone, data；act=1 传 cartIds；act=2 传 product_id/spec_id/taste_name/quantity/cpbs/flag/gid
// total 来自 checkout 返回
export function payByWx(data) {
    return setaxios.post('/cake/wxpay', data)
}

// 支付完成后检测（传订单号 order_no）
export function paySuccess(order_no) {
    return setaxios.post('/cake/pay_success', { order_no })
}

/* ==================== 订单 ==================== */

// 蛋糕订单详情（id 为订单ID；orderinfo.content 是 JSON 字符串，detail 已解析）
export function getCakeOrder(id) {
    return setaxios.post('/cake/dgorder', { id })
}

/* ==================== 地址 ==================== */

// 收货地址-城市列表
export function getShdzCity() {
    return setaxios.post('/cake/shdzcity', {})
}

// 收货地址-区县列表
export function getShdzArea(city_id) {
    return setaxios.post('/cake/shdzarea', { city_id })
}

// 地址列表
export function getAddressList() {
    return setaxios.post('/cake/address', {})
}

// 添加地址
// city 带“市”字，area 区县，addr 不含市/区，is_default 1/0
export function addAddress(data) {
    return setaxios.post('/cake/addaddress', {
        city: data.city,
        area: data.area,
        addr: data.addr,
        name: data.name,
        phone: data.phone,
        tag: data.tag,
        is_default: data.is_default,
         lat: data.lat, 
        lng: data.lng 
    })
}

// 编辑地址（比添加多 id、gid）
export function editAddress(data) {
    return setaxios.post('/cake/editaddress', {
        city: data.city,
        area: data.area,
        addr: data.addr,
        name: data.name,
        phone: data.phone,
        tag: data.tag,
        is_default: data.is_default,
        id: data.id,
        gid: data.gid,
        lat: data.lat, 
        lng: data.lng  
    })
}

// 删除地址（传 gid，不是 id）
export function delAddress(gid) {
    return setaxios.post('/cake/deladdress', { gid })
}

// 设置默认地址（传 id）
export function setDefaultAddress(id) {
    return setaxios.post('/cake/mraddress', { id })
}

// 地址详情
export function getAddressDetail(id) {
    return setaxios.post('/cake/xqaddress', { id })
}

// 福利卡列表
export function getCardList() {
    return setaxios.post('/cake/card', {})
}

/* ==================== 门店 ==================== */

// 选择门店（brand_id 传 pinpai.brand_id）
export function getSelShop({ cid, brand_id }) {
    return setaxios.post('/cake/selshop', { cid, brand_id })
}




/* ==================== 电子券 · 品牌 ==================== */

// 电子券品牌列表
// cid 城市ID, page 页数默认1, limit 条数默认20
export function getCouponsBrand({ cid, page = 1, limit = 20 }) {
    return setaxios.post('/coupons/brand', { cid, page, limit })
}

// 电子券品牌详情
// cid 城市ID, brand_id 品牌ID
export function getCouponsBrandShow({ cid, brand_id }) {
    return setaxios.post('/coupons/bshow', { cid, brand_id })
}

/* ==================== 电子券 · 商品 ==================== */

// 电子券商品详情
// cid 城市ID, id 电子券ID
export function getCouponsDetail({ cid, id }) {
    return setaxios.post('/coupons/detail', { cid, id })
}

// 电子券增加数量（计算总价）
// cid 城市ID, id 电子券ID, shuliang 数量
export function couponsAddNum({ cid, id, shuliang = 1 }) {
    return setaxios.post('/coupons/jia', { cid, id, shuliang })
}

/* ==================== 电子券 · 福利卡 / 支付 ==================== */

// 电子券福利卡列表
export function getCouponsCardList() {
    return setaxios.post('/coupons/getcardlist', {})
}

// 电子券立即支付-计算卡是否够支付
// cid 城市ID, fulika 福利卡号多个逗号隔开(可选), id 电子券ID, shuliang 数量
// 返回 ka_ids、wxprice、dkprice、code
export function couponsPayDate({ cid, fulika = '', id, shuliang = 1 }) {
    return setaxios.post('/coupons/pay_date', { cid, fulika, id, shuliang })
}

// 电子券卡支付
// cid, ka_ids(福利卡ID数组或字符串), dkprice, pass, code, id, shuliang
export function couponsPayByCard(data) {
    return setaxios.post('/coupons/flkpay', {
        cid: data.cid,
        ka_ids: data.ka_ids,
        dkprice: data.dkprice,
        pass: data.pass,
        code: data.code,
        id: data.id,
        shuliang: data.shuliang
    })
}

// 电子券微信支付
// cid, ka_ids(可选), dkprice, wxprice, openid, code, shuliang, id
export function couponsPayByWx(data) {
    return setaxios.post('/coupons/wxpay', {
        cid: data.cid,
        ka_ids: data.ka_ids,
        dkprice: data.dkprice,
        wxprice: data.wxprice,
        openid: data.openid,
        code: data.code,
        shuliang: data.shuliang,
        id: data.id
    })
}

// 电子券支付完成后检测
export function couponsPaySuccess(order_no) {
    return setaxios.post('/coupons/pay_success', { order_no })
}

/* ==================== 电子券 · 订单 ==================== */

// 电子券订单详情（id 为订单ID）
export function getCouponsOrder(id) {
    return setaxios.post('/coupons/dzqorder', { id })
}