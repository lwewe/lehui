import setaxios from '@/utils/setaxios'

// ==================== 通用入口 ====================
export function dramaApi(method, data = {}) {
    return setaxios.post('/perform/getList', {
        method: method,
        data: JSON.stringify(data)
    })
}

// ==================== 演出项目 ====================

// 演出列表
export function getDramaProjectList(data) {
    return dramaApi('xuankua.drama.dramaProjectList', data)
}
// 演出详细信息
export function getDramaProjectDetail(data) {
    return dramaApi('xuankua.drama.dramaProjectDetail', data)
}
// 演出场次
export function getDramaPerformList(data) {
    return dramaApi('xuankua.drama.dramaPerformList', data)
}
// 演出场次价格
export function getDramaPerformPriceList(data) {
    return dramaApi('xuankua.drama.dramaPerformPriceList', data)
}
// 演出快递费用查询
export function getExpressFee(data) {
    return dramaApi('xuankua.drama.getExpressFee', data)
}
// 添加地址-省/市/区城市列表
export function getDramaAddressList(data) {
    return dramaApi('xuankua.drama.addressList', data)
}

// ==================== 独立接口 ====================

// 城市列表
export function getCityList(data) {
    return setaxios.post('/perform/citylist', data)
}
// 热门城市
export function getHotCity() {
    return setaxios.post('/perform/hotcity')
}

// ==================== 观影人 ====================

// 观影人列表
export function getViewerList() {
    return setaxios.post('/perform/viewer')
}
// 新增观影人
export function addViewer(data) {
    return setaxios.post('/perform/addviewer', data)
}
// 查询单个观影人
export function showViewer(data) {
    return setaxios.post('/perform/showviewer', data)
}
// 修改观影人
export function editViewer(data) {
    return setaxios.post('/perform/editviewer', data)
}
// 删除观影人
export function delViewer(data) {
    return setaxios.post('/perform/delviewer', data)
}

// ==================== 收货地址 ====================

export function getAddressList() {
    return setaxios.post('/perform/address')
}
export function addAddress(data) {
    return setaxios.post('/perform/addaddress', data)
}
export function showAddress(data) {
    return setaxios.post('/perform/showaddress', data)
}
export function editAddress(data) {
    return setaxios.post('/perform/editaddress', data)
}
export function delAddress(data) {
    return setaxios.post('/perform/deladdress', data)
}
export function setDefaultAddress(data) {
    return setaxios.post('/perform/mraddress', data)
}

// ==================== 想看 ====================

export function getThinkSeeList(data = {}) {
    return setaxios.post('/perform/thinksee', data)
}
export function addThinkSee(data) {
    return setaxios.post('/perform/addthinksee', data)
}
export function checkThinkSee(data) {
    return setaxios.post('/perform/checkthinksee', data)
}

// ==================== 福利卡 ====================

export function getCardList() {
    return setaxios.post('/perform/card')
}

// ==================== 支付相关（按最新接口文档补全） ====================

/**
 * 计算卡是否够支付
 * POST perform/pay_date
 * @param {Object} data
 * @param {string} data.fulika                福利卡id 多个,拼接
 * @param {string} data.buyerName             联系人名称
 * @param {string} data.buyerPhone            联系人电话
 * @param {string} data.takeTicketTypeCode    取票方式
 * @param {string} data.takeTicketTypeOptional 是否用户自主选择取票方式 0/1
 * @param {string} [data.address_id]          收货地址ID
 * @param {string} [data.moviegoersInfo]      观影人信息
 * @param {string} [data.buyerCardNo]         联系人身份证
 * @param {string} data.type                  1-机选 2-在线选座
 * @param {string} [data.performPriceId]      类型1场次价格priceId
 * @param {string} [data.count]               类型1购票数量
 * @param {string} [data.zwtoken]             类型2座位token
 * @param {string} [data.performId]           类型2场次id
 */
export function PerformIsPayDate(data) {
    return setaxios.post('/perform/pay_date', data)
}

/**
 * 计算卡是否够支付(订单内)
 * POST perform/order_pay_date
 * @param {Object} data
 * @param {string} data.fulika  福利卡id 多个,拼接
 * @param {string} data.oid     订单id
 */
export function PerformOrderPaydate(data) {
    return setaxios.post('/perform/order_pay_date', data)
}

/**
 * 微信支付
 * POST perform/wxpay
 * @param {Object} data
 * @param {string} data.oid      订单id
 * @param {string} [data.ka_ids] 福利卡id 多个json
 * @param {string} data.openid   微信openid
 * @param {string} data.code     返回的code
 * @param {string} data.total    返回的total
 */
export function PerformWxpay(data) {
    return setaxios.post('/perform/wxpay', data)
}

/**
 * 福利卡支付（复用 wxpay 接口，传 ka_ids 走卡支付）
 * 说明：文档里未单独列出卡支付接口，若后端有独立接口请替换路径
 */
export function PerformFlkpay(data) {
    return setaxios.post('/perform/flkpay', data)
}

/**
 * 支付完成回调 / 查询订单支付状态
 * POST perform/pay_success
 * @param {Object} data
 * @param {string} data.order_no 订单号
 */
export function PerformIsPaySuccess(data) {
    return setaxios.post('/perform/pay_success', data)
}

/**
 * 订单详情
 * POST perform/orderdetail
 * @param {Object} data
 * @param {string} [data.id] 订单id
 */
export function getPerOrderDetail(data) {
    return setaxios.post('/perform/orderdetail', data)
}



/**
 * 用户有效期内未支付的订单
 * POST perform/unpayorder
 * 无参数，返回 { orderid: 1 }
 */
export function getUnpayOrder() {
    return setaxios.post('/perform/unpayorder')
}

/**
 * 取消锁座订单
 * POST perform/unlockseat
 * @param {Object} data
 * @param {string} data.oid 订单id
 */
export function PerformUnlockSeat(data) {
    return setaxios.post('/perform/unlockseat', data)
}